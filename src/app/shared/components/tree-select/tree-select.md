<p align="right"><a href="./tree-select.en.md">English</a></p>

# TreeSelect

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Select cujas opções formam uma **árvore**: escolha um nó (com o caminho no campo) ou marque grupos inteiros com checkbox. Construído com **Angular Standalone + HTML/Sass**, sem dependências de UI libs.

- **Arquivos:** `src/app/shared/components/tree-select/` (`tree-select.component.ts`, `tree-utils.ts`)
- **Modelo:** `src/app/shared/model/interface/tree-select/tree-node.interface.ts`
- **Visual:** mesmos tokens do Select (`--sel-*`) e a caixa do Checkbox (`app-checkbox-mark`, tokens `--cb-*`).

O componente **só apresenta**: recebe a árvore (ou uma função que busca os filhos) e devolve **keys**. Não conhece regra de negócio.

| Situação | Componente |
|---|---|
| Lista simples, escolha de um valor | `app-select` |
| Opções em níveis (país → estado → cidade), com seleção de grupo | **`app-tree-select`** |
| Um único sim/não | `app-checkbox` |

---

## Por que existe

Escolher numa lista com níveis (país → estado → cidade) é comum, e o `<select>` nativo não tem árvore. Montar uma à mão exige o padrão WAI-ARIA de tree (setas abrem e fecham níveis, foco num item só), checkbox com estado parcial para marcar grupos inteiros e carregar filhos só quando o nível é aberto. Este componente junta tudo e devolve só as keys.

## Quando usar

### Use quando

- As opções têm níveis e a pessoa escolhe um nó, vendo o caminho até ele.
- Faz sentido marcar um grupo inteiro de uma vez (todos os estados de um país).
- A árvore é grande e os filhos devem ser buscados só quando o nível abre (`loadChildren`).

### Prefira outro

- Lista sem níveis: use o [Select](../select/select.md).
- Um único sim/não: use o [Checkbox](../checkbox/checkbox.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o TreeSelect em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/tree-select/` |
| Componentes que ele usa | `components/checkbox/` |
| Tipos | `model/interface/tree-select/tree-node.interface.ts`<br>`model/type/responsive-mode.type.ts` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/core`, `@angular/forms`, `rxjs`. Ao todo: 13 arquivos, ~1587 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Dados

```ts
interface TreeNode<T = unknown> {
  key: string;            // único na árvore inteira; é o que vai no valor
  label: string;
  value?: T;              // dado extra opcional (não entra no valor)
  children?: TreeNode<T>[];
  leaf?: boolean;         // false (sem children): filhos carregados por loadChildren
  disabled?: boolean;     // desabilita o nó e toda a subárvore
  selectable?: boolean;   // false: só agrupa (não pode ser escolhido/marcado)
}
```

---

## Uso

### Seleção única

```html
<app-tree-select label="Cidade" [nodes]="lugares" [(value)]="cidade" />
```

- O valor é a **key** do nó (`string | null`).
- O campo mostra o **caminho**: "Brasil › São Paulo › Campinas" (`pathSeparator`).
- Por padrão **qualquer nó** pode ser escolhido. Com **`leafOnly`**, só as folhas; clicar num grupo só abre/fecha. `selectable: false` bloqueia um nó específico.

### Vários (checkbox)

```html
<app-tree-select selectionMode="checkbox" filterable label="Permissões"
  [nodes]="permissoes" [formControl]="perms" />
```

- O valor é a **lista de keys das folhas** marcadas, na ordem da árvore. A key de um grupo **nunca** entra.
- **Marcar um grupo** marca todas as folhas habilitadas dele; nós desabilitados são ignorados.
- **Grupo parcial** aparece com "−" (`aria-checked="mixed"`); clicar nele marca o resto. Grupo completo → clicar desmarca tudo.
- **Com a busca ativa**, marcar um grupo marca só as folhas que ele está exibindo.
- O campo mostra **chips** (até `maxChips`) e "+N" para o resto.

### Valor resumido (`valueMode="summary"`)

```html
<app-tree-select selectionMode="checkbox" valueMode="summary" [nodes]="permissoes" [(value)]="perms" />
```

- Grupo com **todas** as folhas marcadas vira **a key do grupo**, e os filhos não aparecem: `["finance"]` em vez de `["finance.reports", "finance.export"]`. Vale em qualquer nível: o país inteiro vira `["br"]`.
- Grupo parcial continua listando as folhas marcadas.
- Uma folha **desabilitada e desmarcada** impede o resumo (o grupo não está completo de verdade): marcar "Vendas" sem "Estornar" dá `["sales.view", "sales.create"]`.
- Na entrada, a key de um grupo marca o grupo inteiro (`[(value)]="['finance']"`).
- O campo mostra um chip por item do valor: "Financeiro", e não as duas ações.

### Filhos sob demanda (`loadChildren`)

Para árvores grandes vindas de API: os nós com `leaf: false` (e sem `children`) buscam os filhos quando são abertos.

```html
<app-tree-select selectionMode="checkbox" valueMode="summary"
  [nodes]="estados" [loadChildren]="carregarCidades" [(value)]="cidades" />
```

```ts
estados: TreeNode[] = [
  { key: 'sp', label: 'São Paulo', leaf: false },
  { key: 'ba', label: 'Bahia', leaf: false },
];

// Promise ou Observable (ex.: HttpClient)
carregarCidades: TreeChildrenLoader = node =>
  this.http.get<TreeNode[]>(`/api/estados/${node.key}/cidades`);
```

- **Busca uma vez por nó** (fechar e abrir de novo não repete). Os filhos podem ter `leaf: false` também (vários níveis). Resposta vazia: o nó vira folha.
- **Carregando:** um anel gira no lugar da seta, a linha fica com `aria-busy` e o leitor de tela ouve "São Paulo: Carregando…".
- **Erro:** o nó fecha, mostra `loadErrorLabel` na linha e o leitor ouve a mensagem; **abrir de novo tenta outra vez**.
- **Marcar sem carregar:** no `checkbox`, um grupo ainda não carregado é marcado como uma unidade — o valor recebe a key dele (`["ba"]`) sem nenhuma busca. Quando os filhos chegam, eles já vêm marcados. Por isso, com `loadChildren`, prefira `valueMode="summary"`: a key de grupo no valor sempre significa "o grupo inteiro".
- Trocar a árvore (`[nodes]`) descarta o que foi carregado e ignora respostas de pedidos antigos.
- A busca (`filterable`) procura só no que já foi carregado. No `single`, um valor fora do que foi carregado aparece pela key (o caminho só existe depois de carregar).

---

## API

### Inputs

| Propriedade         | Tipo                         | Padrão                     | Descrição |
|---------------------|------------------------------|----------------------------|-----------|
| `nodes`             | `TreeNode<T>[]`              | —                          | A árvore (obrigatório). |
| `selectionMode`     | `'single' \| 'checkbox'`     | `'single'`                 | Um nó ou várias folhas. |
| `value`             | `string \| string[] \| null` | `null` / `[]`              | Valor. Two-way via `[(value)]`; com formulários, use `formControl`/`ngModel`. |
| `leafOnly`          | `boolean`                    | `false`                    | `single`: só folhas podem ser escolhidas. |
| `expandedKeys`      | `string[]`                   | `[]`                       | Nós que começam abertos. |
| `filterable`        | `boolean`                    | `false`                    | Campo de busca no painel (sem acento/caixa). |
| `filterPlaceholder` | `string`                     | `''`                       | Placeholder da busca. |
| `emptyMessage`      | `string`                     | `labels.treeSelect.empty` | Texto quando a busca não encontra nada. |
| `label`             | `string`                     | `''`                       | Rótulo do campo. |
| `placeholder`       | `string`                     | `''`                       | Texto com o campo vazio. |
| `pathSeparator`     | `string`                     | `' › '`                    | Separador do caminho (`single`). |
| `maxChips`          | `number`                     | `3`                        | Chips antes do "+N" (`checkbox`). |
| `valueMode`         | `'leaves' \| 'summary'`      | `'leaves'`                 | `checkbox`: keys das folhas, ou grupo completo como uma key. |
| `loadChildren`      | `(node) => Promise<TreeNode[]> \| Observable<TreeNode[]>` | `null` | Busca os filhos dos nós `leaf: false` ao abri-los. |
| `loadingLabel`, `loadErrorLabel` | `string`        | `labels.treeSelect.loading` / `labels.treeSelect.loadError` | Textos do carregamento e do erro (i18n). |
| `clearable`         | `boolean`                    | `false`                    | Botão "×" para limpar. |
| `required`          | `boolean`                    | `false`                    | Mostra "requerido" e valida ao fechar/sair. |
| `error` / `hint`    | `string \| null`             | `null`                     | Erro externo (prioridade) e texto de apoio. |
| `disabled`          | `boolean`                    | `false`                    | Desabilita (o formulário também pode). |
| `responsive`        | `'auto' \| 'menu' \| 'sheet'`| `'auto'`                   | `auto`: vira *sheet* (painel de baixo) até `sheetBreakpoint` px. |
| `sheetBreakpoint`   | `number`                     | `560`                      | Largura máxima para o modo *sheet*. |
| `panelTitle`        | `string \| null`             | `null`                     | Título da *sheet* (padrão: `label`). |
| `requiredLabel`, `requiredError`, `clearAriaLabel`, `closeAriaLabel` | `string` | `labels.required` / `requiredError` / `clearSelection` / `close` | Textos para i18n. |

### Outputs

| Evento        | Payload                      | Quando dispara |
|---------------|------------------------------|----------------|
| `valueChange` | `string \| string[] \| null` | O usuário mudou a seleção. |

---

## Teclado e acessibilidade

O painel segue o **padrão WAI-ARIA de árvore** (`role="tree"`, `treeitem` com `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded`). O foco fica na árvore e o item ativo vai em `aria-activedescendant`.

| Tecla           | No painel |
|-----------------|-----------|
| `↓` / `↑`       | Próximo / anterior nó visível |
| `→`             | Expande; se já aberto, vai ao primeiro filho |
| `←`             | Recolhe; senão, volta ao pai |
| `Home` / `End`  | Primeiro / último nó |
| `Enter` / `Espaço` | Escolhe (`single`) ou marca/desmarca (`checkbox`) |
| Letras          | Pula para o próximo nó visível com aquela inicial |
| `Esc`           | Fecha e volta ao campo |
| `Tab`           | Fecha e segue para o próximo campo |

- Com `filterable`, o foco abre na busca; `↓` leva para a árvore.
- `single`: o nó escolhido tem `aria-selected="true"`. `checkbox`: cada nó tem `aria-checked` (`true`/`false`/`mixed`); a caixa visual é só decoração.
- Os chips são lidos como lista ("Ver pedidos, Relatórios, +1").
- Carregando filhos: `aria-busy` na linha e anúncio numa região `role="status"` (também para o erro).
- Clique fora fecha.

---

## Limitações e próximos passos

- [x] Carregar filhos sob demanda (`loadChildren`).
- [x] Valor resumido no `checkbox` (`valueMode="summary"`).
- [ ] Rolagem virtual (desempenho com milhares de nós ainda não medido).
- [ ] Busca no servidor (hoje o filtro vê só o que já foi carregado).
- Keys são `string`: converta ids numéricos ao montar a árvore.
