# Angular Components (Standalone, HTML + Sass)

> **Objetivo do projeto:** criar **componentes reutilizáveis de UI** (ex.: Stepper) com **HTML + Sass** e **Angular Standalone**, **sem dependências de frameworks de UI** (Material, Bootstrap etc.). A ideia é ter uma base leve, acessível e fácil de portar/“desencapsular” quando necessário.

---

## Por que este projeto?

- **Sem framework de UI**: componentes implementados do zero, mantendo controle visual/semântico.
- **Standalone** (Angular 15+): importação direta do componente, sem módulos.
- **Tematização** por **CSS Custom Properties** (variáveis CSS).
- **Acessível**: marcadores ARIA, estrutura semântica, foco em teclado (quando aplicável).
- **Reaproveitável**: componentes podem ser extraídos para libs internas ou usados como base em outros projetos.

---

## Componentes

### ✅ Stepper
Componente de etapas horizontal, leve e tematizável.

- **Estados**: `pending`, `active`, `done`, `disabled`
- **Inputs**: `steps`, `current`, `clickable`, `showIndex`, `showCaption`
- **Output**: `stepChange` (emite o índice clicado quando permitido)
- **Temas**: variáveis CSS globais em `src/styles.sass` (ex.: `--stepper-color-active`)

Arquivos (por padrão):
```
src/app/shared/components/stepper/
  ├─ stepper.component.ts
  ├─ stepper.component.html
  └─ stepper.component.sass
```

Uso mínimo (exemplo):
```html
<app-stepper
  [steps]="steps"
  [current]="current"
  [clickable]="true"
  (stepChange)="goTo($event)">
</app-stepper>
```

```ts
type StepState = 'pending' | 'active' | 'done' | 'disabled';
interface StepItem { label: string; caption?: string; state?: StepState; id?: string | number; }

steps: StepItem[] = [
  { label: 'Entrega', caption: 'Confira o endereço' },
  { label: 'Produto', caption: 'Defina o cartão' },
  { label: 'Personalização', caption: 'Personalize o cartão' },
  { label: 'Adicional', caption: 'Configure os adicionais' },
  { label: 'Resumo', caption: 'Confira a solicitação' },
];

current = 0;
goTo(i: number) { this.current = i; }
```

Tematização global (exemplo em `src/styles.sass`):
```sass
:root
  --bg: #ffffff
  --surface: #ffffff
  --surface-2: #f7f8f9
  --fg: #14171a
  --muted: #5f6a75
  --border: #e6e9ed

  /* Stepper (exemplo de defaults) */
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

/* Tema escuro */
:root[data-theme="dark"]
  --bg: #0c0d10
  --surface: #121319
  --surface-2: #171924
  --fg: #e7eaf0
  --muted: #a2aab6
  --border: #262a35

  --stepper-text: var(--fg)
  --stepper-caption: #96a0ad
  --stepper-color-default: #3b3f4a
  --stepper-connector: #262a35

/* reset rápido */
html, body
  background: var(--bg)
  color: var(--fg)
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", sans-serif
  margin: 0
```
> As variáveis podem ser sobrescritas por página/área envolvendo o `<app-stepper>` em um container com novas CSS vars.

---

## Padrão para novos componentes

1. Crie a pasta em `src/app/shared/components/<nome>/` com **três arquivos**:
  - `/<nome>.component.ts` (standalone, `ChangeDetectionStrategy.OnPush` quando possível)
  - `/<nome>.component.html`
  - `/<nome>.component.sass`
2. Use **CSS Custom Properties** para cores/medidas, definindo **fallbacks** no Sass (ex.: `var(--minha-cor, #ccc)`).
3. Garanta **acessibilidade** (roles ARIA, labels, foco navegável).
4. Exporte apenas os **inputs/outputs** necessários (API pequena e intencional).
5. Se houver pagina demo, crie em `src/app/pages/<page-name>/` e adicione rota em `app.routes.ts`.

> Dica: considere incluir um `README.md` dentro da pasta do componente detalhando API, exemplos e tokens de tema (ex.: `shared/components/<nome>/<nome>.md`).

### Blueprint (sugestão)
```ts
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nome',
  standalone: true,
  templateUrl: './nome.component.html',
  styleUrl: './nome.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NomeComponent {
  @Input() disabled = false;
  @Output() action = new EventEmitter<void>();
}
```

```html
<section class="nome" [class.is-disabled]="disabled">
  <!-- markup -->
</section>
```

```sass
.nome
  /* use variáveis com fallback */
  color: var(--nome-text, #1f2937)
```

---

## Como rodar

### Dev server
```bash
  ng serve
```
Abra `http://localhost:4200/`. O app recarrega ao salvar alterações.

### Build
```bash
  ng build
```
Artefatos em `dist/`. A configuração padrão visa performance.

### Testes unitários
```bash
  ng test
```

> Se o projeto usar SSR: há script de `serve:ssr:*` no `package.json` quando aplicável.

---

## Roadmap

- [ ] Modo **vertical** para o Stepper
- [ ] Suporte a **ícones** por etapa
- [ ] **Atalhos de teclado** (setas) e `aria-controls` para associar painéis
- [ ] Componentes adicionais (ex.: `Breadcrumb`, `Tag/Badge`, `Pagination`, `Toast`)

---

## Filosofia

- **Simplicidade primeiro**: HTML semântico + Sass, sem dependências pesadas.
- **API explícita**: inputs/outputs previsíveis.
- **Design tokens** via CSS vars.
- **Portabilidade**: fácil de extrair para libs internas, web components ou outras stacks.

---

## Licença

MIT — use, adapte e contribua.
