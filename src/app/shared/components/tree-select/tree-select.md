<p align="right"><a href="./tree-select.en.md">English</a></p>

# TreeSelect

Select cujas opções formam uma **árvore**: escolha um nó (com o caminho no campo) ou marque grupos inteiros com checkbox. Construído com **Angular Standalone + HTML/Sass**, sem dependências de UI libs.

- **Arquivos:** `src/app/shared/components/tree-select/` (`tree-select.component.ts`, `tree-utils.ts`)
- **Modelo:** `src/app/shared/model/interface/tree-select/tree-node.interface.ts`
- **Visual:** mesmos tokens do Select (`--sel-*`) e a caixa do Checkbox (`app-checkbox-mark`, tokens `--cb-*`).

O componente **só apresenta**: recebe a árvore pronta e devolve **keys**. Não chama API nem conhece regra de negócio.

| Situação | Componente |
|---|---|
| Lista simples, escolha de um valor | `app-select` |
| Opções em níveis (país → estado → cidade), com seleção de grupo | **`app-tree-select`** |
| Um único sim/não | `app-checkbox` |

---

## Dados

```ts
interface TreeNode<T = unknown> {
  key: string;            // único na árvore inteira; é o que vai no valor
  label: string;
  value?: T;              // dado extra opcional (não entra no valor)
  children?: TreeNode<T>[];
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
| `emptyMessage`      | `string`                     | `'Nenhum item encontrado'` | Texto quando a busca não encontra nada. |
| `label`             | `string`                     | `''`                       | Rótulo do campo. |
| `placeholder`       | `string`                     | `''`                       | Texto com o campo vazio. |
| `pathSeparator`     | `string`                     | `' › '`                    | Separador do caminho (`single`). |
| `maxChips`          | `number`                     | `3`                        | Chips antes do "+N" (`checkbox`). |
| `clearable`         | `boolean`                    | `false`                    | Botão "×" para limpar. |
| `required`          | `boolean`                    | `false`                    | Mostra "requerido" e valida ao fechar/sair. |
| `error` / `hint`    | `string \| null`             | `null`                     | Erro externo (prioridade) e texto de apoio. |
| `disabled`          | `boolean`                    | `false`                    | Desabilita (o formulário também pode). |
| `responsive`        | `'auto' \| 'menu' \| 'sheet'`| `'auto'`                   | `auto`: vira *sheet* (painel de baixo) até `sheetBreakpoint` px. |
| `sheetBreakpoint`   | `number`                     | `560`                      | Largura máxima para o modo *sheet*. |
| `panelTitle`        | `string \| null`             | `null`                     | Título da *sheet* (padrão: `label`). |
| `requiredLabel`, `requiredError`, `clearAriaLabel`, `closeAriaLabel` | `string` | PT-BR | Textos para i18n. |

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
- Clique fora fecha.

---

## Limitações e próximos passos

- [ ] Carregar filhos sob demanda (`loadChildren`) para árvores grandes vindas de API.
- [ ] Rolagem virtual (desempenho com milhares de nós ainda não medido).
- [ ] Valor "resumido" no `checkbox` (pai completo vira uma key só).
- Keys são `string`: converta ids numéricos ao montar a árvore.
