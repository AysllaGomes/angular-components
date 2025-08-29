# Stepper (HTML + Sass, Standalone Angular)

Um **componente de etapas** leve, acessível e _framework-agnostic_ no que diz respeito ao UI (apenas Angular “casca” para inputs/outputs). Implementado com **HTML + Sass** e **Angular Standalone**.

> **Objetivo**: oferecer um stepper reutilizável e facilmente tematizável (CSS Custom Properties) para fluxos de múltiplas etapas.

---

## Visão geral

- **Estados**: `pending`, `active`, `done`, `disabled`
- **Acessibilidade**: usa `role="tablist"`/`role="tab"`, `aria-selected` e `aria-disabled`
- **Interação**: clique opcional para navegar por etapas
- **Tematização**: via variáveis CSS (cores/tipos de linha, etc.)
- **Responsivo**: textos ficam abaixo e centralizados em relação ao indicador (bullet)

**Estrutura HTML** (simplificada): `nav.stepper > ol.stepper-list > li.stepper-item > button.stepper-button (bullet + texts) + span.connector`.

```html
<nav class="stepper">
  <ol class="stepper-list">
    <li class="stepper-item ...">
      <button class="stepper-button" type="button" role="tab">
        <span class="bullet" aria-hidden="true">
          <span class="check">✓</span>
          <span class="index">1</span>
        </span>
        <span class="texts">
          <span class="label">Entrega</span>
          <span class="caption">Confira o endereço</span>
        </span>
      </button>
      <span class="connector" aria-hidden="true"></span>
    </li>
  </ol>
</nav>
```

---

## Instalação & Estrutura

Crie o componente em:

```
src/app/shared/components/stepper/
  ├─ stepper.component.ts
  ├─ stepper.component.html
  └─ stepper.component.sass
```

> O projeto pode manter um **pacote de componentes standalone**. Este stepper não depende de bibliotecas de UI.

---

## Uso rápido

### 1) Template

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

### 2) Componente (TypeScript)

```ts
import { Component, signal } from '@angular/core';
import { StepperComponent } from '@app/shared/components/stepper/stepper.component';

export interface StepItem {
  label: string;
  caption?: string;
  state?: 'pending' | 'active' | 'done' | 'disabled';
  id?: string | number;
}

@Component({
  selector: 'app-order-flow',
  standalone: true,
  imports: [StepperComponent],
  template: `
    <app-stepper
      [steps]="steps"
      [current]="current()"
      [clickable]="true"
      (stepChange)="goTo($event)"/>
  `
})
export class OrderFlowComponent {
  steps: StepItem[] = [
    { label: 'Entrega',         caption: 'Confira o endereço' },
    { label: 'Produto',         caption: 'Defina o cartão' },
    { label: 'Personalização',  caption: 'Personalize o cartão' },
    { label: 'Adicional',       caption: 'Configure os adicionais' },
    { label: 'Resumo',          caption: 'Confira a solicitação' },
  ];

  current = signal(0);

  goTo(i: number) { this.current.set(i); }
}
```

---

## API

### Inputs

| Propriedade     | Tipo                                   | Padrão | Descrição |
|-----------------|----------------------------------------|:------:|-----------|
| `steps`         | `StepItem[]` (obrigatório)             |  —     | Lista ordenada de etapas. |
| `current`       | `number`                               | `0`    | Índice base‑0 da etapa ativa. |
| `clickable`     | `boolean`                              | `true` | Habilita clique para navegar. Avanço permitido até `current + 1`. |
| `showIndex`     | `boolean`                              | `true` | Exibe o número dentro do bullet (inativas). |
| `showCaption`   | `boolean`                              | `true` | Exibe legenda (caption) abaixo do rótulo. |

### Outputs

| Evento        | Payload   | Descrição |
|---------------|-----------|-----------|
| `stepChange`  | `number`  | Emite o índice da etapa clicada quando permitido. |

### Tipos

```ts
export type StepState = 'pending' | 'active' | 'done' | 'disabled';

export interface StepItem {
  label: string;
  caption?: string;
  state?: StepState;
  id?: string | number;
}
```

---

## Tematização (CSS Custom Properties)

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

> Qualquer variável acima pode ser sobrescrita **por página** envolvendo o `<app-stepper>` em um container com novas variáveis.

### Dicas de layout
- **Textos centralizados abaixo do bullet**: o stepper já posiciona os textos em coluna, alinhados ao centro do bullet.
- **Linha/connector**: por padrão é sempre cinza. Se quiser evidenciar etapas concluídas, você pode aplicar `background: var(--stepper-color-done)` no `.stepper-item.is-done .connector`.

---

## Acessibilidade

- `role="tablist"` no container e `role="tab"` nos botões de etapa.
- `aria-selected` para a etapa ativa.
- `aria-disabled` quando o clique é bloqueado (ex.: etapas futuras além de `current + 1` ou com `state: 'disabled'`).

> Extensões possíveis: navegação por teclado (setas esquerda/direita) e `aria-controls` para associar a painéis de conteúdo.

---

## Regras de navegação por clique

- O clique é permitido por padrão (`clickable=true`).
- Pode voltar para etapas anteriores a qualquer momento.
- Pode avançar **no máximo** até a etapa `current + 1` (evita “pular” validações).
- Etapas com `state: 'disabled'` não recebem clique.

> Essa regra pode ser alterada no método `canClick(i)` do componente, se o fluxo exigir mais liberdade.

---

## Boas práticas de uso

- **Sincronizar rota**: é comum vincular `current` a um parâmetro de rota (`/fluxo/:step`) ou query string (`?step=2`) para deep‑link e refresh estável.
- **Responsividade**: em telas menores, a legenda (`caption`) é escondida automaticamente (padrão Sass).
- **Testes**: o stepper não guarda estado interno complexo; teste a regra de clique e a renderização dos estados por índice.

---

## Roadmap (sugestões)

- Modo **vertical** (grid em coluna, conectores verticais).
- **Slots**/templates (expor `ng-template` para personalizar `bullet` ou `label` por etapa).
- Suporte a **ícones** por etapa (ex.: `step.icon`).
- Animações leves (ex.: preenchimento do bullet, transição do connector).

---

## Licença

MIT — use e adapte à vontade dentro do projeto.

