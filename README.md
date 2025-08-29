# Angular Components (Standalone, HTML + Sass)

> **Propósito:** criar **componentes de UI reutilizáveis** (ex.: Stepper) com **HTML + Sass** e **Angular Standalone**, **sem depender de frameworks de UI**. A ideia é ter uma base leve, acessível e fácil de portar/“desencapsular” quando necessário.

- Demo local: `http://localhost:4200/demo`
- Stack: Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties para theming.

---

## Componentes

### ✅ Stepper
Componente de etapas horizontal, acessível e tematizável por CSS vars. Documentação completa em:
```
src/app/shared/components/stepper/stepper.md
```

> À medida que novos componentes surgirem, cada um deve ter sua própria pasta em
> `src/app/shared/components/<nome>/` com um `README.md` descrevendo API, exemplos e tokens de tema.

---

## Estrutura sugerida

```
src/
  app/
    demo/                   # página de demonstração com header/footer/sections
    shared/
      components/
        stepper/
          stepper.component.ts
          stepper.component.html
          stepper.component.sass
          stepper.md        # documentação do componente
    app.routes.ts
  styles.sass               # tokens e variáveis globais
```

---

## Como rodar

### Dev server
```bash
  ng serve
```
Abra `http://localhost:4200/demo`. A aplicação recarrega ao salvar.

### Build
```bash
  ng build
```
Artefatos em `dist/` (modo server/SSR conforme `angular.json`).

### Testes
```bash
  ng test
```

---

## Padrão para novos componentes

1. **Standalone**: crie `/<nome>.component.ts` com `standalone: true` e, quando viável, `ChangeDetectionStrategy.OnPush`.
2. **Arquivos**: `html`, `sass` e `README.md` do componente na mesma pasta.
3. **Theming**: use **CSS Custom Properties** com fallbacks, ex.: `color: var(--badge-fg, #1f2937)`.
4. **Acessibilidade**: use marcação semântica e `role`/`aria-*` quando aplicável.
5. **Demo**: adicione uma _section_ na página de demo para visualização/QA.

### Blueprint
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
/* nome.component.sass */
.nome
  color: var(--nome-text, #1f2937)
```

---

## Theming global

Defina no `styles.sass` (global) para padronizar em todo o app:

```sass
:root
  --stepper-color-active:   #00a39b
  --stepper-color-done:     #2fbf71
  --stepper-color-default:  #c8ccd2
  --stepper-color-disabled: #dcdfe4
  --stepper-text:           #1f2937
  --stepper-caption:        #6b7280
  --stepper-connector:      #e6e9ed
  --stepper-bullet-bg:      #ffffff
  --stepper-color-number-active: #ffffff
```

Você pode sobrescrever por página envolvendo o componente em um container que redefine essas variáveis.

---

## SSR (cuidados)

Em serviços/utilitários que acessam `window`, `document` ou `localStorage`, cheque o ambiente com `isPlatformBrowser`. O `ThemeService` já está **SSR-safe**.

---

## Roadmap

- [ ] Novas seções na demo para cada componente
- [ ] Stepper vertical / com ícones / navegação por teclado
- [ ] Componentes adicionais (Badge, Pagination, Toast)

---

## Licença

MIT — use, adapte e contribua.
