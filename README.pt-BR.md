<p align="right"><a href="./README.md">English</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Demo](https://aysllagomes.github.io/angular-components.github.io/demo)**

- **[CHANGELOG.md](./CHANGELOG.pt-BR.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Propósito:** criar **componentes de UI reutilizáveis** (ex.: Stepper, Table, Pagination, Toast) com **Angular Standalone** em **HTML + Sass**, **sem depender de frameworks de UI**. Base leve, acessível e fácil de portar/“desencapsular”.

- **Demo local:** `http://localhost:4200/demo`
- **Stack:** Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties (theming).

---

## Componentes

| Componente | Descrição | Docs | Demo |
|-----------:|-----------|------|------|
| **Stepper** | Stepper horizontal, clicável, com estados (ativo, feito, desabilitado) e tokens de tema. | [PT-BR](src/app/shared/components/stepper/stepper.md) · [EN](src/app/shared/components/stepper/stepper.en.md) | `/demo#stepper` |
| **Table** | Tabela flexível com checkbox por linha, coluna de ações (declarativa via `[actions]` ou *slot* `appActions`), *chips* e células custom. | [PT-BR](src/app/shared/components/table/table.md) · [EN](src/app/shared/components/table/table.en.md) | `/demo#table` |
| **Pagination** | Paginação independente (bolhas numéricas + setas), controlada por `total`, `pageSize` e `pageIndex`. | [PT-BR](src/app/shared/components/pagination/pagination.md) · [EN](src/app/shared/components/pagination/pagination.en.md) | `/demo#pagination` |
| **Toast** | Toast leve (serviço + container), acessível e tematizável. | [PT-BR](src/app/shared/components/toast/toast.md) · [EN](src/app/shared/components/toast/toast.en.md) | `/demo#toast` |

---

## Theming global

```sass
:root
  --accent: #058075

  /* Stepper */
  --stepper-color-active: var(--accent)
  --stepper-color-done:   var(--accent)
  --stepper-color-default: #c8ccd2
  --stepper-color-disabled: #dcdfe4
  --stepper-text: var(--fg)
  --stepper-caption: var(--muted)
  --stepper-connector: #e6e9ed
  --stepper-bullet-bg: #ffffff
  --stepper-color-number-active: #ffffff

  /* Tabela (cabeçalho deriva do accent) */
  --tbl-header-bg: color-mix(in srgb, var(--accent) 28%, #0f1720)
  --tbl-header-fg: #ffffff
  --tbl-row-bg: #ffffff
  --tbl-row-border: #e6e9ed
  --tbl-fg: #0f1720
  --tbl-muted: #6b7280
  --tbl-action: var(--accent)
  --tbl-header-hover: color-mix(in srgb, var(--accent) 36%, #0f1720)

  /* Paginação */
  --pg-active-bg: var(--accent)
  --pg-active-fg: #ffffff
  --pg-page-bg: #f2f4f7
  --pg-ghost-bg: #eeeeee
  --pg-hover: color-mix(in srgb, var(--accent) 12%, white)
  --pg-fg: #0f1720

  /* Toast */
  --toast-radius: .75rem
  --toast-shadow: 0 6px 20px rgba(0,0,0,.12)

/* Dark */
:root[data-theme="dark"]
  --bg: #0c0d10
  --fg: #e7eaf0
  --tbl-header-bg: color-mix(in srgb, var(--accent) 44%, #0b1220)
  --tbl-header-fg: #e7eaf0
  --pg-page-bg: #1f2937
  --pg-ghost-bg: #111827
  --pg-active-fg: #0b1220

/* Presets de accent */
:root[data-accent="teal"]
  --accent: #058075
:root[data-accent="orange"]
  --accent: #D17A30
:root[data-accent="violet"]
  --accent: #6D5BD0
```

---

## Licença

MIT — use, adapte e contribua.
