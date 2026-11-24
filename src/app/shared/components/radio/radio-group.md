<p align="right"><a href="./radio-group.en.md">English</a></p>

# Radio group

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Escolha **única** entre poucas opções visíveis. Construído sobre `<fieldset>` + `<legend>` e `<input type="radio">` **nativos**, com os tokens de cor do Checkbox (`--cb-*`).

- **Arquivo:** `src/app/shared/components/radio/radio-group.component.ts`
- **Modelo:** `src/app/shared/components/radio/radio.types.ts`

| Quando usar | Componente |
|---|---|
| Poucas opções (até ~5), todas visíveis | **`app-radio-group`** |
| Muitas opções, ou pouco espaço | `app-select` |
| Liga/desliga uma configuração | `app-switch` |

## Por que existe

Radios nativos já são acessíveis, mas o grupo precisa de `<fieldset>` com `<legend>`, um `name` em comum, erro ligado ao grupo e integração com formulários, e isso costuma ser esquecido. Este componente monta o grupo certo a partir de uma lista de opções, com o mesmo visual do Checkbox.

## Quando usar

### Use quando

- A pessoa escolhe uma única opção entre poucas (até umas 5).
- Vale mostrar todas as opções de uma vez, para comparar.

### Prefira outro

- Muitas opções, ou pouco espaço: use o [Select](../select/select.md).
- Ligar ou desligar uma configuração: use o [Switch](../switch/switch.md).
- Várias opções ao mesmo tempo: use o [Checkbox group](../checkbox-group/checkbox-group.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Radio group em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/radio/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/core`, `@angular/forms`. Ao todo: 6 arquivos, ~489 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso

```ts
plans: RadioOption<string>[] = [
  { label: 'Básico', value: 'basic', description: 'Até 3 projetos, sem custo' },
  { label: 'Pro', value: 'pro' },
  { label: 'Empresa', value: 'enterprise', disabled: true },
];
```

```html
<app-radio-group label="Plano" [options]="plans" [(value)]="plano" />

<app-radio-group label="Entrega" orientation="horizontal" required
  [options]="entregas" [formControl]="entrega"
  [error]="entrega.touched && entrega.invalid ? 'Escolha uma forma de entrega.' : null" />
```

## API

### Inputs

| Propriedade     | Tipo                         | Padrão        | Descrição |
|-----------------|------------------------------|---------------|-----------|
| `options`       | `RadioOption<T>[]`           | —             | `{ label, value, disabled?, description? }`. |
| `label`         | `string`                     | `''`          | Nome do grupo (vira o `<legend>`). |
| `value`         | `T \| null`                  | `null`        | Two-way via `[(value)]`; com formulários, use `formControl`/`ngModel`. |
| `orientation`   | `'vertical' \| 'horizontal'` | `'vertical'`  | Disposição das opções (horizontal quebra linha se faltar espaço). |
| `name`          | `string \| null`             | gerado        | `name` dos inputs (único por grupo por padrão). |
| `disabled`      | `boolean`                    | `false`       | Desabilita o grupo inteiro (o formulário também pode). |
| `required`      | `boolean`                    | `false`       | Mostra "requerido" e repassa `required`. Para validar, use `Validators.required`. |
| `hint` / `error`| `string \| null`             | `null`        | Texto de apoio / erro (erro marca `aria-invalid`). |
| `requiredLabel` | `string`                     | `labels.required` | Texto do indicador (i18n). |

### Outputs

| Evento        | Payload     | Quando dispara |
|---------------|-------------|----------------|
| `valueChange` | `T \| null` | O usuário escolheu outra opção. |

## Acessibilidade e teclado

- `<fieldset>` + `<legend>`: o leitor de tela anuncia o nome do grupo ao entrar nele.
- Radios **nativos** com o mesmo `name`: `Tab` entra no grupo (na opção marcada) e sai dele; **setas** trocam a opção, pulando as desabilitadas; `Espaço` marca a focada.
- A `description` de cada opção, a dica e o erro são ligados por `aria-describedby`.
