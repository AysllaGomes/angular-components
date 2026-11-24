<p align="right"><a href="./forms.en.md">English</a></p>

# Formulários: validação centralizada e máscaras

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Peças para formulários reativos (Angular Forms) que funcionam com todos os componentes da biblioteca (`app-select`, `app-tree-select`, `app-checkbox`, `app-radio-group`, `app-switch`) e com inputs nativos.

```ts
import { AppValidators, FieldErrorPipe, FormValidationDirective, MaskDirective } from 'src/app/shared/forms';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
```

| Peça | Para quê |
|---|---|
| `AppValidators` | Validadores de CPF, CNPJ (inclusive alfanumérico) e CPF/CNPJ |
| `FormErrorsService` + `provideFormErrorMessages()` | Mensagem de cada tipo de erro, num lugar só e traduzida |
| pipe `fieldError` | Mensagem pronta para o input `error` dos componentes |
| diretiva `appFormValidation` | Envio: mostra todos os erros e foca o primeiro campo inválido |
| diretiva `appMask` | Máscara de digitação em `<input>` |
| `app-form-field` | Rótulo, dica e erro em volta de um `<input>` nativo |

---

## Por que existe

Sem um lugar central, cada tela escreve as mensagens de erro de novo, valida CPF/CNPJ de um jeito diferente e, ao enviar, deixa a pessoa procurando o campo com problema. Estas peças juntam as mensagens num lugar só (e traduzidas), mostram todos os erros e focam o primeiro campo inválido no envio, e funcionam igual nos componentes da biblioteca e nos inputs nativos.

## Quando usar

### Use quando

- Qualquer formulário reativo com validação.
- Campos de documento brasileiro (CPF, CNPJ, inclusive o alfanumérico).
- Campos com formato fixo que ficam mais claros com máscara (telefone, CEP).

### Prefira outro

- Avisar o resultado do envio (salvo, falhou): use o [Toast](../components/toast/toast.md).
- Validação que depende do servidor: faça a chamada e mostre o erro no campo com a mesma mensagem central.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar os Formulários em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `forms/`, `components/form-field/` |
| Textos padrão | `labels/` ([Textos dos componentes](../labels/labels.md)) |

Depende só de `@angular/core`, `@angular/forms`. Ao todo: 12 arquivos, ~771 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Exemplo completo

```ts
form = new FormGroup({
  nome:  new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  doc:   new FormControl('', { nonNullable: true, validators: [Validators.required, AppValidators.cpfOrCnpj()] }),
  fone:  new FormControl('', { nonNullable: true }),
  plano: new FormControl<string | null>(null, Validators.required),
  termos: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
});
```

```html
<form [formGroup]="form" appFormValidation (validSubmit)="salvar($event)">
  <app-form-field label="Nome completo" required [error]="form.controls.nome | fieldError">
    <input formControlName="nome" autocomplete="name">
  </app-form-field>

  <app-form-field label="CPF ou CNPJ" required [error]="form.controls.doc | fieldError">
    <input appMask="cpfCnpj" formControlName="doc">
  </app-form-field>

  <app-form-field label="Telefone">
    <input appMask="phone" formControlName="fone" type="tel">
  </app-form-field>

  <app-radio-group label="Plano" required [options]="planos" formControlName="plano"
                   [error]="form.controls.plano | fieldError" />

  <app-checkbox formControlName="termos" required [error]="form.controls.termos | fieldError">
    Li e aceito os termos
  </app-checkbox>

  <button appButton type="submit">Enviar</button>
</form>
```

```ts
salvar(valor: typeof this.form.value) {
  // só chega aqui com o formulário válido; "doc" vem sem máscara ("12ABC34501DE35")
  this.api.salvar(valor).subscribe({
    error: () => this.toast.error('Não foi possível salvar.'), // toast = resposta do back-end
  });
}
```

---

## Validadores — `AppValidators`

Tabela completa na [API](#api), abaixo.

- Aceitam o valor **com ou sem máscara**.
- **Ignoram vazio**: combine com `Validators.required` quando o campo for obrigatório.
- **CNPJ alfanumérico** (IN RFB 2.229/2024, emitido desde jul/2026): as 12 primeiras posições podem ter letras; os 2 dígitos verificadores são sempre números. Ex.: `12.ABC.345/01DE-35`.
- Funções avulsas: `isValidCpf()`, `isValidCnpj()`, `onlyDigits()`, `onlyAlnum()`.

---

## Mensagens — `FormErrorsService` e pipe `fieldError`

```html
<app-select formControlName="estado" [error]="form.controls.estado | fieldError" />
```

- O pipe só mostra a mensagem depois que o campo foi **tocado** (a pessoa saiu dele) ou quando o formulário foi enviado com `appFormValidation`.
- Com mais de um erro, `required` vem primeiro; os outros seguem a ordem do controle.
- Mensagens padrão: `formErrors` de [`provideUiLabels`](../labels/labels.md) (padrão em inglês), com os dados do erro como parâmetros. Com `UI_LABELS_PT`:

| Erro | Mensagem (PT) |
|---|---|
| `required` (inclui `Validators.requiredTrue`) | Campo obrigatório |
| `email` | E-mail inválido |
| `minlength` / `maxlength` | Mínimo / Máximo de {{requiredLength}} caracteres |
| `min` / `max` | O mínimo é {{min}} / O máximo é {{max}} |
| `pattern` | Formato inválido |
| `cpf` / `cnpj` / `cpfCnpj` | CPF inválido / CNPJ inválido / CPF ou CNPJ inválido |
| qualquer outro | Valor inválido |

### Mudar ou acrescentar mensagens (num lugar só)

```ts
// app.config.ts
providers: [
  provideFormErrorMessages({
    required: 'Preencha este campo',                       // texto
    senhaFraca: 'Use {{min}}+ caracteres',                   // erro próprio, com parâmetro
    minlength: e => `Faltam ${e.requiredLength - e.actualLength} caracteres`, // função
  }),
]
```

> Para mostrar a mensagem em outro lugar, use o serviço: `inject(FormErrorsService).messageFor(control.errors)`.

---

## Envio — diretiva `appFormValidation`

```html
<form [formGroup]="form" appFormValidation (validSubmit)="salvar($event)" (invalidSubmit)="...">
```

- **Inválido:** marca todos os campos como tocados (todas as mensagens aparecem) e **leva o foco ao primeiro campo com erro**, na ordem da tela — inclusive dentro dos componentes (o botão do Select, o radio do grupo...), rolando até ele.
- **Válido:** emite `validSubmit` com `form.getRawValue()`.
- Não mostra toast: avisos por toast ficam para erros do back-end.

---

## Máscaras — diretiva `appMask`

```html
<input appMask="cpf"     formControlName="cpf">     <!-- 000.000.000-00 -->
<input appMask="cnpj"    formControlName="cnpj">    <!-- SS.SSS.SSS/SSSS-00 (alfanumérico) -->
<input appMask="cpfCnpj" formControlName="doc">     <!-- CPF; vira CNPJ após 11 caracteres ou ao digitar letra -->
<input appMask="phone"   formControlName="fone">    <!-- (00) 0000-0000 ou (00) 00000-0000 -->
<input appMask="cep"     formControlName="cep">     <!-- 00000-000 -->
<input appMask="date"    formControlName="data">    <!-- 00/00/0000 -->
<input appMask="000-AAA" formControlName="codigo">  <!-- padrão próprio -->
```

- **Padrão próprio:** `0` dígito · `A` letra · `*` letra ou dígito (em maiúsculas); o resto é literal.
- **O formulário recebe o valor sem máscara** (`"52998224725"`) e a tela mostra formatado. Para guardar o texto formatado: `[unmask]="false"`.
- Valores vindos do formulário (`setValue`, `patchValue`) aparecem formatados.
- O cursor fica no lugar certo ao digitar ou editar no meio; máscaras só de dígitos abrem o **teclado numérico** no celular (`inputmode="numeric"`).
- Funciona com `formControl`, `formControlName` e `ngModel` (é o *value accessor* do input).

### Placeholder

Use o atributo nativo para mostrar o **formato** esperado — ele some ao digitar, então nunca substitui o rótulo:

```html
<app-form-field label="CEP">
  <input appMask="cep" formControlName="cep" placeholder="00000-000">
</app-form-field>
```

- Coloque o formato ou um exemplo (`000.000.000-00`, `Ex.: Ana Lima`), não instruções: o que for importante continuar visível vai em `hint`.
- A cor vem do token `--sel-placeholder` (a mesma do Select), com contraste AA nos dois temas.

---

## Campo de texto — `app-form-field`

```html
<app-form-field label="E-mail" required hint="Usaremos para recuperar a senha" [error]="ctrl | fieldError">
  <input type="email" [formControl]="ctrl" autocomplete="email">
</app-form-field>
```

Tabela completa na [API](#api), abaixo.

O campo projetado continua **nativo** (`<input>`, `<textarea>` ou `<select>`): formulários, `appMask` e o *autocomplete* do navegador funcionam normalmente. Se o campo já tiver `id`, ele é mantido. Visual: tokens do Select (`--sel-*`).

---

## API

### `AppValidators`

| Validador | Erro | Regra |
|---|---|---|
| `AppValidators.cpf()` | `{ cpf: true }` | 11 dígitos e dígitos verificadores corretos |
| `AppValidators.cnpj()` | `{ cnpj: true }` | 14 caracteres; numérico **ou alfanumérico** |
| `AppValidators.cpfOrCnpj()` | `{ cpfCnpj: true }` | 11 caracteres → CPF; 14 → CNPJ |

### `appFormValidation` · Outputs

| Evento | Payload | Quando dispara |
|---|---|---|
| `validSubmit` | `form.getRawValue()` | Formulário enviado e válido. |
| `invalidSubmit` | `void` | Formulário enviado e inválido; o foco já foi para o primeiro campo com erro. |

Seletor: `form[formGroup][appFormValidation]`.

### `appMask` · Inputs

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `appMask` | `'cpf' \| 'cnpj' \| 'cpfCnpj' \| 'phone' \| 'cep' \| 'date' \| string` | obrigatório | Máscara pronta ou padrão próprio (`0` dígito, `A` letra, `*` letra ou dígito). |
| `unmask` | `boolean` | `true` | O formulário recebe o valor sem máscara. Com `false`, recebe o texto formatado. |

Seletor: `input[appMask]`.

### Pipe `fieldError`

| Uso | Retorno | Descrição |
|---|---|---|
| `control \| fieldError` | `string \| null` | Mensagem do primeiro erro (`required` antes dos outros), só depois que o campo foi tocado ou o formulário enviado. |

### `app-form-field`

| Propriedade     | Tipo             | Padrão        | Descrição |
|-----------------|------------------|---------------|-----------|
| `label`         | `string`         | `''`          | Rótulo (ligado ao campo por `for`/`id`). |
| `required`      | `boolean`        | `false`       | Mostra "requerido" e marca `aria-required`. |
| `hint`          | `string \| null` | `null`        | Texto de apoio (`aria-describedby`). |
| `error`         | `string \| null` | `null`        | Erro: substitui a dica, deixa a borda vermelha e marca `aria-invalid`. |
| `requiredLabel` | `string`         | `labels.required` | Texto do indicador (i18n). |

## Acessibilidade

- O erro de cada campo fica ligado a ele por `aria-describedby` e o campo recebe `aria-invalid`, nos componentes da biblioteca e no `app-form-field`.
- As mensagens só aparecem depois que a pessoa sai do campo, para ninguém ser interrompido no meio da digitação.
- Ao enviar com erro, o foco vai para o primeiro campo inválido na ordem da tela (inclusive dentro do Select, do Radio group...), rolando até ele. Não há toast: o erro fica junto do campo.
- `app-form-field` liga rótulo e campo por `for`/`id` e marca `aria-required` quando obrigatório.
- `appMask` mantém o cursor no lugar ao editar e abre o teclado numérico no celular (`inputmode="numeric"`) nas máscaras só de dígitos.
- Placeholder mostra só o formato e nunca substitui o rótulo; a cor tem contraste AA nos dois temas.
