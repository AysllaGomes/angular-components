<p align="right"><a href="./checkbox.en.md">English</a></p>

# Checkbox

Checkbox acessível com **estado parcial** (indeterminado), integrado a formulários. Construído com **Angular Standalone + HTML/Sass**, sem dependências de UI libs.

- **Arquivos:** `src/app/shared/components/checkbox/checkbox.component.ts` e `checkbox-mark.component.ts`
- **Tema:** tokens `--cb-*` no `styles.sass`, seguindo a cor de destaque e o tema claro/escuro.

São dois componentes:

| Componente | Para quê |
|---|---|
| `app-checkbox` | O checkbox completo: rótulo, clique, teclado, formulários, dica e erro. |
| `app-checkbox-mark` | **Só a caixa visual** (desmarcado/marcado/parcial). Para desenhar checkboxes dentro de outros componentes, como uma árvore ou uma lista, onde quem anuncia o estado é o próprio item. |

---

## Por que existe

O checkbox nativo não tem o estado parcial no HTML (só por JavaScript), é difícil de estilizar e não traz dica nem erro. Este componente acrescenta o estado parcial (indeterminado), integra com Reactive Forms e `ngModel` e liga rótulo, dica e erro ao campo, sem perder o comportamento nativo de teclado e leitor de tela.

## Quando usar

### Use quando

- Aceitar algo antes de enviar (termos, consentimento).
- Marcar vários itens de uma lista, com um "selecionar todos" que fica parcial.
- Escolhas que só valem ao enviar o formulário.

### Prefira outro

- Ligar ou desligar algo que vale na hora: use o [Switch](../switch/switch.md).
- Escolher uma única opção entre poucas: use o [Radio group](../radio/radio-group.md).
- Várias opções de uma lista, com o valor em lista: use o [Checkbox group](../checkbox-group/checkbox-group.md).
- Muitas opções em níveis: use o [TreeSelect](../tree-select/tree-select.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Checkbox em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/checkbox/` |

Depende só de `@angular/core`, `@angular/forms`. Ao todo: 5 arquivos, ~246 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso básico

```html
<app-checkbox [(checked)]="aceito">Aceito os termos</app-checkbox>
```

O **rótulo é o conteúdo** do componente. Sem texto visível, use `ariaLabel`:

```html
<app-checkbox [(checked)]="selecionado" ariaLabel="Selecionar linha" />
```

---

## API — `app-checkbox`

### Inputs

| Propriedade     | Tipo             | Padrão  | Descrição |
|-----------------|------------------|---------|-----------|
| `checked`       | `boolean`        | `false` | Marcado. Two-way via `[(checked)]`. Com formulários, use `formControl`/`ngModel`. |
| `indeterminate` | `boolean`        | `false` | Estado **parcial** ("−"). Tem prioridade visual sobre `checked`. Ao clicar, sai do parcial e fica marcado. Two-way via `[(indeterminate)]`. |
| `disabled`      | `boolean`        | `false` | Desabilita. Aceita o atributo vazio. O formulário também desabilita (`control.disable()`). |
| `required`      | `boolean`        | `false` | Repassa `required` ao input nativo. Para validar, use `Validators.requiredTrue`. |
| `name`          | `string \| null` | `null`  | `name` do input nativo. |
| `ariaLabel`     | `string \| null` | `null`  | Rótulo para leitor de tela quando não há texto visível. |
| `hint`          | `string \| null` | `null`  | Texto de apoio abaixo, ligado por `aria-describedby`. |
| `error`         | `string \| null` | `null`  | Mensagem de erro: substitui a dica, deixa a caixa vermelha e marca `aria-invalid`. |

### Outputs

| Evento                | Payload   | Quando dispara |
|-----------------------|-----------|----------------|
| `checkedChange`       | `boolean` | O usuário marcou/desmarcou. |
| `indeterminateChange` | `boolean` | O usuário clicou num checkbox parcial (sai do parcial). |

### Formulários

Funciona com `formControl`, `formControlName` e `ngModel`; o valor é `boolean`:

```ts
terms = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });
```

```html
<app-checkbox required [formControl]="terms"
  [error]="terms.touched && terms.invalid ? 'Você precisa aceitar os termos.' : null">
  Li e aceito os termos de uso
</app-checkbox>
```

---

## Exemplo — "selecionar todos"

O estado parcial existe para isso: o "pai" fica parcial quando só alguns filhos estão marcados. O estado do pai é **derivado** dos filhos:

```ts
allChecked  = computed(() => this.count() === this.items.length);
someChecked = computed(() => this.count() > 0 && !this.allChecked());

/** parcial ou vazio → marca todos; todos → desmarca todos */
setAll(value: boolean) {
  const v = this.someChecked() ? true : value;
  // ... aplica v em todos os filhos
}
```

```html
<app-checkbox [checked]="allChecked()" [indeterminate]="someChecked()" (checkedChange)="setAll($event)">
  Todas as notificações
</app-checkbox>
```

---

## API — `app-checkbox-mark`

| Propriedade | Tipo                                     | Padrão        | Descrição |
|-------------|------------------------------------------|---------------|-----------|
| `state`     | `'unchecked' \| 'checked' \| 'mixed'`    | `'unchecked'` | Estado desenhado. |
| `disabled`  | `boolean`                                | `false`       | Visual desabilitado. |

É **decorativa** (`aria-hidden="true"`): quem a usa precisa anunciar o estado, por exemplo um `role="treeitem"` com `aria-checked="true|false|mixed"`. Para realçar a caixa no hover de uma linha inteira, sobrescreva as variáveis no próprio elemento:

```sass
.linha:hover app-checkbox-mark
  --cbm-border: var(--cb-checked-bg)
  --cbm-ring: var(--cb-hover-ring)
```

---

## Acessibilidade

- Por baixo há um **`<input type="checkbox">` nativo** (invisível, sobre a caixa): teclado (`Espaço`), clique no rótulo, `required` e foco vêm do navegador.
- O estado parcial usa a **propriedade nativa `indeterminate`**, que leitores de tela anunciam como "parcialmente marcado".
- Dica e erro ligados por `aria-describedby`; erro com `aria-invalid="true"`.
- Foco por teclado mostra um anel na caixa (`--cb-focus-ring`); hover da linha inteira realça a caixa.

---

## Tokens (CSS Custom Properties)

```sass
:root
  --cb-size: 20px
  --cb-radius: 5px
  --cb-border: #6b7c80
  --cb-bg: var(--surface)
  --cb-checked-bg: var(--accent)
  --cb-mark: #ffffff
  --cb-disabled-bg: #eef0f2
  --cb-disabled-border: #c4cacd
  --cb-disabled-checked-bg: #c4cacd
  --cb-hover-ring: color-mix(in srgb, var(--accent) 16%, transparent)
  --cb-focus-ring: color-mix(in srgb, var(--accent) 45%, transparent)

:root[data-theme="dark"]
  --cb-border: #8a94a3
  --cb-disabled-bg: #171924
  --cb-disabled-border: #2e3340
  --cb-disabled-checked-bg: #3a3f4b
```

---

## Roadmap

- [x] Estados marcado / desmarcado / parcial, desabilitado, dica e erro.
- [x] Formulários (`formControl`, `ngModel`).
- [x] Caixa reutilizável (`app-checkbox-mark`).
- [x] `app-tree-select`, usando a caixa em cada nó.
- [x] Grupo de checkboxes com valor em lista: [Checkbox group](../checkbox-group/checkbox-group.md).
