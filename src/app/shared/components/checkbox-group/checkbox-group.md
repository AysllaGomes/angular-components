<p align="right"><a href="./checkbox-group.en.md">English</a></p>

# Checkbox group

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Escolha **múltipla** entre opções visíveis: o valor é a lista do que está marcado. Construído sobre `<fieldset>` + `<legend>` e `<input type="checkbox">` **nativos**, com a mesma caixa do Checkbox (`app-checkbox-mark`, tokens `--cb-*`) e um "Selecionar todos" opcional.

- **Arquivo:** `src/app/shared/components/checkbox-group/checkbox-group.component.ts`
- **Modelo:** `src/app/shared/components/checkbox-group/checkbox-group.types.ts`

| Quando usar | Componente |
|---|---|
| Várias opções ao mesmo tempo, todas visíveis | **`app-checkbox-group`** |
| Uma única opção entre poucas | `app-radio-group` |
| Um único sim/não (aceite, confirmação) | `app-checkbox` |
| Muitas opções em árvore, ou pouco espaço | `app-tree-select` (modo `checkbox`) |

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Checkbox group em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/checkbox-group/` |
| Componentes que ele usa | `components/checkbox/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/core`, `@angular/forms`. Ao todo: 11 arquivos, ~803 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Por que existe

Uma lista de checkboxes parece simples, mas o grupo precisa de `<fieldset>` com `<legend>`, um valor em lista que não dependa da ordem dos cliques, erro e dica ligados a cada caixa e integração com formulários; e o "Selecionar todos" precisa do estado parcial e não pode mexer nas opções desabilitadas. Este componente monta tudo isso a partir de uma lista de opções, com o mesmo visual do Checkbox.

## Quando usar

### Use quando

- A pessoa pode marcar várias opções, ou nenhuma, entre poucas (até umas 10).
- Vale mostrar todas as opções de uma vez, como preferências de aviso ou permissões.

### Prefira outro

- Só uma opção pode ser escolhida: use o [Radio group](../radio/radio-group.md).
- Um único sim/não, como aceitar os termos: use o [Checkbox](../checkbox/checkbox.md).
- Muitas opções, ou organizadas em grupos dentro de grupos: use o [TreeSelect](../tree-select/tree-select.md) no modo `checkbox`.
- A mudança vale na hora, como ligar uma configuração: use o [Switch](../switch/switch.md).

## Uso

```ts
topicos: CheckboxOption<string>[] = [
  { label: 'Novidades', value: 'news', description: 'Uma vez por mês' },
  { label: 'Promoções', value: 'deals' },
  { label: 'Segurança da conta', value: 'security', disabled: true },
];
avisos = new FormControl<string[]>(['security'], { nonNullable: true, validators: Validators.required });
```

```html
<app-checkbox-group label="Avisos por e-mail" selectAll required
  [options]="topicos" [formControl]="avisos"
  [error]="avisos.touched && avisos.invalid ? 'Escolha pelo menos um aviso.' : null" />

<!-- sem formulário -->
<app-checkbox-group label="Interesses" orientation="horizontal" [options]="interesses" [(value)]="escolhidos" />
```

- O **valor** é a lista dos `value` marcados, sempre **na ordem das opções** (não na ordem dos cliques). Um valor que chega de fora e não está nas opções é mantido no fim, para não sumir dado salvo.
- **Obrigatório:** `required` só mostra o marcador no rótulo do grupo. Valide no formulário: `Validators.required` já trata a lista vazia como inválida. (O `required` nativo em cada caixa exigiria marcar **todas**.)
- **Selecionar todos** (`selectAll`): marca as opções habilitadas que faltam; se já estão todas, desmarca todas. Fica **parcial** quando só algumas estão marcadas. Opções desabilitadas ficam como estão.

## API

### Inputs

| Propriedade      | Tipo                         | Padrão              | Descrição |
|------------------|------------------------------|---------------------|-----------|
| `options`        | `CheckboxOption<T>[]`        | —                   | `{ label, value, disabled?, description? }`. |
| `label`          | `string`                     | `''`                | Nome do grupo (vira o `<legend>`). |
| `value`          | `T[] \| null`                | `null`              | Two-way via `[(value)]`; com formulários, use `formControl`/`ngModel`. |
| `orientation`    | `'vertical' \| 'horizontal'` | `'vertical'`        | Disposição das opções (horizontal quebra linha se faltar espaço). |
| `name`           | `string \| null`             | gerado              | `name` dos inputs (único por grupo por padrão). |
| `selectAll`      | `boolean`                    | `false`             | Mostra a caixa "Selecionar todos" acima das opções. |
| `selectAllLabel` | `string`                     | `labels.selectAll`  | Texto da caixa "Selecionar todos" (i18n). |
| `disabled`       | `boolean`                    | `false`             | Desabilita o grupo inteiro (o formulário também pode). |
| `required`       | `boolean`                    | `false`             | Mostra "requerido" no rótulo. Para validar, use `Validators.required`. |
| `hint` / `error` | `string \| null`             | `null`              | Texto de apoio / erro (erro marca `aria-invalid`). |
| `requiredLabel`  | `string`                     | `labels.required`   | Texto do indicador (i18n). |

### Outputs

| Evento        | Payload | Quando dispara |
|---------------|---------|----------------|
| `valueChange` | `T[]`   | O usuário marcou ou desmarcou uma opção (ou usou "Selecionar todos"). |

## Acessibilidade e teclado

- `<fieldset>` + `<legend>`: o leitor de tela anuncia o nome do grupo ao entrar nele.
- Checkboxes **nativos**: `Tab` passa por cada caixa (pulando as desabilitadas) e `Espaço` marca/desmarca; clicar no texto também marca.
- "Selecionar todos" é um checkbox nativo com estado **parcial** (`indeterminate`), anunciado como "parcialmente marcado", e aponta para as caixas que controla (`aria-controls`).
- A `description` de cada opção, a dica e o erro são ligados por `aria-describedby`; o erro marca `aria-invalid` em cada caixa.

## Tokens

Os mesmos do Checkbox, com valor padrão: `--cb-size`, `--cb-border`, `--cb-bg`, `--cb-checked-bg`, `--cb-hover-ring`, `--cb-focus-ring`, `--cb-disabled-border`, `--cb-disabled-bg`. O erro usa `--danger`.
