<p align="right"><a href="./README.md">English</a></p>

# Angular Components (Standalone, HTML + Sass)

> **Propósito:** criar **componentes de UI reutilizáveis** (ex.: Stepper, Table, Pagination) com **Angular Standalone** em **HTML + Sass**, **sem depender de frameworks de UI**. Base leve, acessível e fácil de portar/“desencapsular”.

- **Demo local:** `http://localhost:4200/demo`
- **Stack:** Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties (theming).

---

## Componentes

| Componente | Descrição | Documentação | Demo |
|-----------:|-----------|--------------|------|
| **Stepper** | Stepper horizontal, clicável, com estados (ativo, feito, desabilitado) e tokens de tema. | `src/app/shared/components/stepper/stepper.md` | `/demo#stepper` |
| **Table** | Tabela flexível com checkbox por linha, coluna de ações (declarativa via `[actions]` ou *slot* `appActions`), *chips* e células custom. | `src/app/shared/components/table/table.md` | `/demo#table` |
| **Pagination** | Paginação independente (bolhas numéricas + setas), controlada por `total`, `pageSize` e `pageIndex`. | `src/app/shared/components/pagination/pagination.md` | `/demo#pagination` |

> Cada componente deve ter sua própria pasta em `src/app/shared/components/<nome>/` com um **README/MD** cobrindo **API**, **exemplos**, **tokens de tema** e **boas práticas**.

---

## Estrutura sugerida

```
src/
  app/
    demo/                     # página de demonstração (header/footer/sections)
      demo-page.component.*
      sections/
        stepper-demo.component.*
        table-demo.component.*
        pagination-demo.component.*
    shared/
      components/
        stepper/
          stepper.component.ts
          stepper.component.html
          stepper.component.sass
          stepper.md
        table/
          table.component.ts
          table.component.html
          table.component.sass
          table.directives.ts   # appCell / appActions
          table.md
        pagination/
          pagination.component.ts
          pagination.component.html
          pagination.component.sass
          pagination.md
    app.routes.ts
  styles.sass                  # tokens e variáveis globais
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

1. **Standalone**: `standalone: true` e, quando viável, `ChangeDetectionStrategy.OnPush`.
2. **Arquivos**: `*.component.ts/html/sass` + `README.md` do componente na mesma pasta.
3. **Theming**: use **CSS Custom Properties** com *fallbacks* (`var(--badge-fg, #1f2937)`).
4. **Acessibilidade**: marcação semântica, `role`/`aria-*` e foco visível quando aplicável.
5. **Demo**: adicione uma *section* na página de demo e um link no header.

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

Defina no `styles.sass` tokens globais (Stepper, Table e Pagination) e sobrescreva por página quando necessário:

```sass
:root
  /* Stepper */
  --stepper-color-active:   #00a39b
  --stepper-color-done:     #2fbf71
  --stepper-color-default:  #c8ccd2
  --stepper-color-disabled: #dcdfe4
  --stepper-text:           #1f2937
  --stepper-caption:        #6b7280
  --stepper-connector:      #e6e9ed
  --stepper-bullet-bg:      #ffffff
  --stepper-color-number-active: #ffffff

  /* Table */
  --tbl-header-bg: #07363c
  --tbl-header-fg: #ffffff
  --tbl-row-bg: #f2f5f7
  --tbl-row-gray-medium: #ffffff
  --tbl-row-border: #e6e9ed
  --tbl-fg: #0f1720
  --tbl-muted: #6b7280
  --tbl-action: #058075

  /* Pagination */
  --pg-active-bg: var(--tbl-action, #058075)
  --pg-active-fg: #ffffff
  --pg-page-bg: #eef6f4
  --pg-ghost-bg: #eeeeee
  --pg-hover: color-mix(in oklab, var(--pg-active-bg) 12%, white)
  --pg-fg: #0f1720
```

---

## SSR (cuidados)

Em serviços/utilitários que acessam `window`, `document` ou `localStorage`, cheque o ambiente com `isPlatformBrowser`. O `ThemeService` está **SSR-safe** e serve como exemplo.

---

## Roadmap

- [ ] Novas seções na demo para cada componente
- [ ] Stepper: vertical / ícones / navegação por teclado
- [ ] Table: ordenação, empty/loading/error, paginação, ações em massa
- [ ] Pagination: primeira/última página, atalhos de teclado, versão compacta
- [ ] Componentes adicionais (Badge, Toast, seletor de page-size)

---

## Licença

MIT — use, adapte e contribua.
