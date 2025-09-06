<p align="right"><a href="./README.md">English</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Demo](https://aysllagomes.github.io/angular-components.github.io/demo)**

- **[CHANGELOG.md](./CHANGELOG.pt-BR.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Propósito:** criar **componentes de UI reutilizáveis** (ex.: **ActionBar**, Select, Stepper, Table, Pagination, Toast) com **Angular Standalone** em **HTML + Sass**, **sem depender de frameworks de UI**. Base leve, acessível e fácil de portar/“desencapsular”.

- **Demo local:** `http://localhost:4200/demo`
- **Stack:** Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties (theming).

---

## Componentes

| Componente     | Descrição                                                                                                                                         | Docs                                                                                                                      | Demo               |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------|
| **ActionBar**  | *Sheet* lateral com título, conteúdo e ações no rodapé. Tamanhos `sm`/`md`/`lg`/`auto`, integra ao accent, *focus trap*, fechar por ESC/backdrop. | [PT-BR](src/app/shared/components/actionbar/actionbar.md) · [EN](src/app/shared/components/actionbar/actionbar.en.md)     | `/demo#actionbar`  |
| **Stepper**    | Stepper horizontal, clicável, com estados (ativo, feito, desabilitado) e tokens de tema.                                                          | [PT-BR](src/app/shared/components/stepper/stepper.md) · [EN](src/app/shared/components/stepper/stepper.en.md)             | `/demo#stepper`    |
| **Table**      | Tabela flexível com checkbox por linha, coluna de ações (declarativa via `[actions]` ou *slot* `appActions`), *chips* e células custom.           | [PT-BR](src/app/shared/components/table/table.md) · [EN](src/app/shared/components/table/table.en.md)                     | `/demo#table`      |
| **Pagination** | Paginação independente (bolhas numéricas + setas), controlada por `total`, `pageSize` e `pageIndex`.                                              | [PT-BR](src/app/shared/components/pagination/pagination.md) · [EN](src/app/shared/components/pagination/pagination.en.md) | `/demo#pagination` |
| **Toast**      | Toast leve (serviço + container), acessível e tematizável.                                                                                        | [PT-BR](src/app/shared/components/toast/toast.md) · [EN](src/app/shared/components/toast/toast.en.md)                     | `/demo#toast`      |
| **Select**     | Select leve, acessível e tematizável.                                                                                                             | [PT-BR](src/app/shared/components/select/select.md) · [EN](src/app/shared/components/select/select.en.md)                 | `/demo#select`     |

---

## Licença

MIT — use, adapte e contribua.
