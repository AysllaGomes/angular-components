<p align="right"><a href="./form-field.en.md">English</a></p>

# Campo de texto (`app-form-field`)

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Moldura para `<input>`, `<textarea>` e `<select>` **nativos**: rótulo, "requerido", dica, erro, contador de caracteres, prefixo/sufixo e botão de mostrar a senha. O campo continua sendo o elemento nativo, então `formControl`, `ngModel`, `appMask`, `type`, `autocomplete` e `inputmode` funcionam como sempre. Para o `<textarea>` crescer com o texto, use a diretiva `appAutosize`.

- **Arquivos:** `src/app/shared/components/form-field/form-field.component.ts` e `autosize.directive.ts`

| Quando usar | Componente |
|---|---|
| Texto livre, número, e-mail, senha, CPF (com `appMask`) | **`app-form-field`** + `<input>` |
| Texto longo (observações, descrição) | **`app-form-field`** + `<textarea appAutosize>` |
| Escolher entre opções conhecidas | `app-select` |
| Opções em árvore | `app-tree-select` |

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Campo de texto em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/form-field/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/core`, `@angular/forms`. Ao todo: 6 arquivos, ~688 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Por que existe

Um campo de texto acessível precisa de rótulo ligado por `for`/`id`, dica e erro ligados por `aria-describedby`, `aria-invalid` e `aria-required` no lugar certo, e o mesmo visual em todo o formulário. Componentes que **recriam** o `<input>` costumam esconder atributos nativos (`type`, `autocomplete`, `inputmode`) e atrapalhar máscaras e gerenciadores de senha. Esta moldura faz o contrário: você escreve o `<input>` nativo e ela liga tudo nele, além de oferecer contador, prefixo/sufixo e mostrar a senha sem reinventar o campo.

## Quando usar

### Use quando

- A pessoa digita: nome, e-mail, telefone, CPF/CNPJ (com `appMask`), valores, senha, observações.
- O campo tem limite de caracteres que vale mostrar (`maxlength` + `counter`).
- Há uma unidade ou símbolo fixo junto do valor, como "R$" ou "kg".

### Prefira outro

- As respostas possíveis são conhecidas: use o [Select](../select/select.md), ou o [Radio group](../radio/radio-group.md) se forem poucas e couberem na tela.
- Opções organizadas em níveis: use o [TreeSelect](../tree-select/tree-select.md).
- Um sim/não: use o [Checkbox](../checkbox/checkbox.md) ou, se vale na hora, o [Switch](../switch/switch.md).

## Uso

```html
<app-form-field label="E-mail" required hint="Usaremos para recuperar a senha" [error]="form.controls.email | fieldError">
  <input type="email" autocomplete="email" formControlName="email">
</app-form-field>

<app-form-field label="Senha" required passwordToggle>
  <input type="password" autocomplete="current-password" formControlName="senha">
</app-form-field>

<app-form-field label="Valor do pedido">
  <span ffPrefix>R$</span>
  <input inputmode="decimal" formControlName="valor">
</app-form-field>

<app-form-field label="Observações" counter hint="Visível só para a equipe">
  <textarea maxlength="280" appAutosize="6" formControlName="obs"></textarea>
</app-form-field>
```

- **Contador** (`counter`): mostra "42/280" a partir do `maxlength` do campo e acompanha a digitação e os valores vindos do formulário (`setValue`, `reset`). O leitor de tela ouve "42 de 280 caracteres" ao focar e, perto do limite, "Restam 5 caracteres" depois de uma pausa na digitação (não a cada tecla).
- **Prefixo e sufixo** (`[ffPrefix]` / `[ffSuffix]`): ficam dentro da caixa e **não** entram no valor. Com texto ("R$", "kg"), descrevem o campo para o leitor de tela; um ícone sem texto, não (marque-o `aria-hidden="true"`).
- **Mostrar a senha** (`passwordToggle`): botão dentro do campo que alterna entre `password` e `text`. A senha volta a ficar oculta quando o formulário é enviado.
- **Textarea que cresce** (`appAutosize`): a altura acompanha o texto até o máximo de linhas e, dali em diante, rola. Também acompanha valores vindos do formulário e a largura do campo.

## API

### `app-form-field` · Inputs

| Propriedade          | Tipo             | Padrão                   | Descrição |
|----------------------|------------------|--------------------------|-----------|
| `label`              | `string`         | `''`                     | Rótulo do campo (ligado por `for`/`id`). |
| `required`           | `boolean`        | `false`                  | Mostra o marcador e põe `aria-required` no campo. Para validar, use o validador do formulário. |
| `requiredLabel`      | `string`         | `labels.required`        | Texto do marcador. |
| `hint`               | `string \| null` | `null`                   | Dica abaixo do campo (some quando há erro). |
| `error`              | `string \| null` | `null`                   | Erro (ex.: `ctrl \| fieldError`); marca `aria-invalid`. |
| `counter`            | `boolean`        | `false`                  | Mostra "n/máximo" a partir do `maxlength` do campo. |
| `counterAnnounceAt`  | `number \| null` | 20% do limite (mín. 5)   | A partir de quantos caracteres restantes o leitor de tela ouve "Restam N". |
| `passwordToggle`     | `boolean`        | `false`                  | Botão de mostrar/ocultar no `<input type="password">`. |
| `showPasswordLabel`  | `string`         | `labels.formField.showPassword` | Nome do botão (o estado vai em `aria-pressed`). |

Slots: `[ffPrefix]` e `[ffSuffix]` (conteúdo dentro da caixa, antes e depois do campo).

### `appAutosize` (no `<textarea>`)

| Entrada       | Tipo     | Padrão | Descrição |
|---------------|----------|--------|-----------|
| `appAutosize` | `number` | `8`    | Máximo de linhas antes de rolar (`appAutosize` sozinho = 8; `0` = sem limite). |

## Acessibilidade

- **Rótulo** ligado ao campo por `for`/`id` (o id do campo é mantido; sem id, a moldura cria um).
- **Descrição** (`aria-describedby`): o erro ou a dica, o texto do prefixo/sufixo e o contador, nessa ordem. `aria-invalid` com erro e `aria-required` com `required`.
- **Contador**: o "42/280" visível é `aria-hidden`; o leitor de tela lê a frase inteira ("42 de 280 caracteres"). O aviso de limite usa uma região `aria-live="polite"`, só nos últimos caracteres e depois de 1 s sem digitar.
- **Mostrar a senha**: botão de verdade, com nome fixo ("Mostrar senha") e o estado em `aria-pressed`, apontando para o campo (`aria-controls`). O foco fica no botão ao alternar.
- **Foco visível**: o anel fica na caixa inteira (`:focus-within`), inclusive com prefixo/sufixo.
- **Textarea que cresce**: não muda o foco nem a posição do cursor; o puxador manual some (a altura é automática).

## Tokens

Os mesmos do Select, com valor padrão: `--sel-bg`, `--sel-fg`, `--sel-border`, `--sel-placeholder`, `--sel-focus-ring`, `--sel-disabled-bg`, `--sel-error`, além de `--accent` (borda em foco) e `--muted` (dica, contador, prefixo/sufixo).

## Textos

| Texto | Label | Input |
|---|---|---|
| Marcador ao lado do rótulo quando `required` | `labels.required` | `requiredLabel` |
| Contador para leitor de tela ("42 de 280 caracteres") | `labels.formField.counter` | — |
| Aviso perto do limite ("Restam 5 caracteres") | `labels.formField.remaining` | — |
| Nome do botão de mostrar a senha | `labels.formField.showPassword` | `showPasswordLabel` |
