<p align="right"><a href="./stepper.en.md">English</a></p>

# Stepper (HTML + Sass, Standalone Angular)

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Um **componente de etapas** leve e acessível, implementado em **HTML + Sass**, exposto como Angular **Standalone**. Sem dependência de UI framework.

---

## Por que existe

Um fluxo em etapas precisa mostrar onde a pessoa está, o que já foi feito e o que ainda falta, e isso também para quem usa leitor de tela (`aria-current="step"`, etapas concluídas anunciadas). Também precisa impedir que alguém pule etapas sem passar pela validação. Este componente cuida da apresentação e da regra de clique; o conteúdo de cada etapa fica com você.

## Quando usar

### Use quando

- Uma tarefa longa dividida em etapas que seguem uma ordem (cadastro, checkout).
- Uma etapa depende do que foi preenchido na anterior.
- A pessoa precisa ver quanto falta para terminar.

### Prefira outro

- Seções independentes, abertas em qualquer ordem: use as [Tabs](../tabs/tabs.md).
- Um formulário curto que cabe numa tela: não divida em etapas.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Stepper em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/stepper/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/core`. Ao todo: 6 arquivos, ~543 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Recursos

- **Estados**: `pending`, `active`, `done`, `disabled`
- **Interação**: clique opcional para navegar (`clickable`), regra padrão permite voltar e avançar até `current + 1`
- **Acessibilidade**: `nav` com nome (`ariaLabel`) e lista ordenada; etapa atual com `aria-current="step"`; concluídas anunciadas ("concluída")
- **Theming**: via **CSS Custom Properties** (cores/tamanhos), com fallbacks
- **Responsivo**: textos abaixo e centralizados em relação ao bullet; captions ocultas em telas pequenas

---

## Arquivos

```
src/app/shared/components/stepper/
  ├─ stepper.component.ts
  ├─ stepper.component.html
  └─ stepper.component.sass
```

---

## Uso básico

### Template
```html
<app-stepper
  [steps]="steps"
  [current]="current"
  [clickable]="true"
  [showIndex]="true"
  [showCaption]="true"
  (stepChange)="goTo($event)">
</app-stepper>
```

### Componente
```ts
export type StepState = 'pending' | 'active' | 'done' | 'disabled';

export interface StepItem {
  label: string;
  caption?: string;
  state?: StepState;
  id?: string | number;
}

steps: StepItem[] = [
  { label: 'Entrega',         caption: 'Confira o endereço' },
  { label: 'Produto',         caption: 'Defina o cartão' },
  { label: 'Personalização',  caption: 'Personalize o cartão' },
  { label: 'Adicional',       caption: 'Configure os adicionais' },
  { label: 'Resumo',          caption: 'Confira a solicitação' },
];

current = 0;
goTo(i: number) { this.current = i; }
```

---

## API

### Inputs

| Propriedade   | Tipo       | Padrão | Descrição |
|---------------|------------|:------:|-----------|
| `steps`       | `StepItem[]` | —    | Lista ordenada de etapas. |
| `current`     | `number`   | `0`    | Índice base-0 da etapa ativa. |
| `clickable`   | `boolean`  | `true` | Habilita clique para navegar (até `current + 1`). |
| `showIndex`   | `boolean`  | `true` | Exibe número dentro do bullet nas etapas não concluídas. |
| `showCaption` | `boolean`  | `true` | Exibe legenda abaixo do rótulo. |
| `ariaLabel`   | `string`   | `labels.stepper.label` | Nome da navegação para leitores de tela. |
| `doneLabel`   | `string`   | `labels.stepper.done` | Texto (só leitor de tela) das etapas concluídas. |

### Output

| Evento       | Payload  | Descrição |
|--------------|----------|-----------|
| `stepChange` | `number` | Emite o índice clicado quando permitido. |

---

## Estrutura HTML (resumo)

```
nav.stepper (aria-label)
└─ ol.stepper-list
   └─ li.stepper-item
      ├─ button.stepper-button (aria-current="step" na atual)
      │  ├─ span.bullet
      │  │  ├─ span.check (✓ se "done")
      │  │  └─ span.index (número)
      │  └─ span.texts
      │     ├─ span.label
      │     └─ span.caption
      └─ span.connector
```

---

## Theming (CSS vars)

Defina no `styles.sass` (global) para padronizar em todo o app:

```sass
:root
  --stepper-connector: #A4A4A4
  --stepper-connector-active: var(--stepper-color-active)
  --stepper-bullet-bg: #FFFFFF
  --stepper-color-number-active: #FFFFFF
  --stepper-color-active: #058075
  --stepper-color-done: #058075
  --stepper-color-default: #c8ccd2
  --stepper-color-disabled: #dcdfe4
  --stepper-text: #0A655E
  --stepper-caption: #818181
  --stepper-bullet-muted-bg: #eff1f3

  --stepper-bullet-size: 28px
```

Você pode sobrescrever **por página** ou **por instância** (via `[style.--token]` no componente).

### Principais pontos no Sass do componente
- **Bullet** usa `--stepper-bullet-size` para altura/largura
- **Conector** é `position: absolute` e alinha no **meio** do bullet:  
  `top: calc(var(--stepper-bullet-size) / 2 - 1px)` e `left: calc(50% + var(--stepper-bullet-size) / 2)`
- **Ativa**: bullet preenchido com `--stepper-color-active` e número branco (`--stepper-color-number-active`)

---

## Exemplos

### Etapa desabilitada
```ts
steps = [
  { label: 'Etapa 1' },
  { label: 'Etapa 2' },
  { label: 'Etapa 3', state: 'disabled' },
  { label: 'Etapa 4' },
];
```

### Modo compacto (por wrapper)
```html
<div class="compact">
  <app-stepper [steps]="steps" [current]="current" [clickable]="false"></app-stepper>
</div>
```
```sass
/* page.sass */
.compact
  --stepper-bullet-size: 24px
  .stepper-item .texts .label
    font-size: .9rem
```

---

## Acessibilidade & Navegação

- É uma **navegação com lista ordenada** (não abas): `nav[aria-label] > ol > li > button`. Use nomes diferentes (`ariaLabel`) se houver mais de um stepper na página.
- `aria-current="step"` marca a etapa atual; etapas concluídas têm um texto só para leitor de tela (`doneLabel`, padrão "concluída"). Etapas não alcançáveis ficam `disabled`.
- Regra padrão de clique: voltar livre; avançar **até** `current + 1` (evita “pular” validações).  
  Ajuste essa regra no método `canClick()` conforme seu fluxo.

---

## Roadmap

- [ ] Modo **vertical**
- [ ] Suporte a **ícones** por etapa
- [ ] Navegação por **teclado** (setas) e `aria-controls` para painéis

---

## Licença

MIT — use e adapte à vontade dentro do projeto.

