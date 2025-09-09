# Dialog

Sheet/modal acessível e leve para confirmações e pequenos formulários. Construído com **Angular Standalone + HTML/Sass**, sem dependências de UI libs.

- **Arquivo:** `src/app/shared/components/dialog/dialog.component.ts`
- **Estilos:** `src/app/shared/components/dialog/dialog.component.sass`
- **Padrões:** segue tokens de tema (CSS Custom Properties) e herda “accent”.

---

## API

### Inputs

| Propriedade       | Tipo                             | Padrão       | Descrição                                                               |
|-------------------|----------------------------------|--------------|-------------------------------------------------------------------------|
| `title`           | `string`                         | `'Dialog'`   | Título mostrado no cabeçalho.                                           |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'auto'` | `'auto'`     | Largura do dialog. `auto` se adapta ao conteúdo (via `ResizeObserver`). |
| `opened`          | `boolean`                        | `false`      | Controla abertura. Suporta two‑way via `[(opened)]`.                    |
| `closeOnBackdrop` | `boolean`                        | `true`       | Fecha ao clicar no backdrop.                                            |
| `primaryLabel`    | `string \| null`                 | `null`       | Texto do botão primário padrão. Se `null`, não renderiza.               |
| `secondaryLabel`  | `string \| null`                 | `null`       | Texto do botão secundário padrão. Se `null`, não renderiza.             |

### Outputs

| Evento           | Payload     | Quando dispara                            |
|------------------|-------------|-------------------------------------------|
| `openedChange`   | `boolean`   | Espelha mudanças de `opened` (two‑way).   |
| `primary`        | `void`      | Clique no botão primário padrão.          |
| `secondary`      | `void`      | Clique no botão secundário padrão.        |

### Slots / Projeções

| Seleção               | Descrição                                                                                                    |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| **conteúdo padrão**   | Corpo do diálogo.                                                                                            |
| `[dialog-actions]`    | Slot opcional para **ações customizadas**. Se usado, o componente não renderiza `primary/secondary` padrões. |

---

## Acessibilidade

- `role="dialog"` e `aria-modal="true"` no contêiner do sheet.
- `aria-labelledby` aponta para o ID do título.
- **Foco inicial** vai para o botão “fechar”. **Trap de foco** mantém a navegação dentro do diálogo.
- **Teclado:** `Esc` fecha; `Tab`/`Shift+Tab` navega entre itens focáveis.
- **Backdrop:** habilitado por padrão; pode ser desativado com `closeOnBackdrop=false`.

---

## Tokens (CSS Custom Properties)

O Dialog utiliza tokens próprios; todos possuem valores por tema (claro/escuro) e respeitam o `--accent`.

```css
:root {
  --dlg-bg: var(--surface);
  --dlg-fg: var(--fg);
  --dlg-border: var(--border);
  --dlg-title: var(--fg);
  --dlg-close: var(--muted);
  --dlg-shadow: 0 24px 60px rgba(0,0,0,.18);
  --dlg-backdrop: color-mix(in srgb, #000 38%, transparent);
}
:root[data-theme="dark"] {
  --dlg-bg: #0f141d;
  --dlg-fg: var(--fg);
  --dlg-border: #2a2f3c;
  --dlg-title: var(--fg);
  --dlg-close: #9aa3af;
  --dlg-shadow: 0 24px 60px rgba(0,0,0,.35);
  --dlg-backdrop: color-mix(in srgb, #000 55%, transparent);
}
```

> Os botões internos reutilizam as mesmas classes **`.btn`** e **`.btn--ghost`** do ActionBar.

---

## Exemplos

### 1) Básico (com i18n)

```html
<article class="card" style="display:grid;gap:.5rem;">
  <button class="pill" type="button" (click)="openDlg=true">
    {{ 'dialog.open' | t }}
  </button>
</article>

<app-dialog
  [title]="'dialog.title.delete' | t"
  size="auto"
  [(opened)]="openDlg"
  [primaryLabel]="'dialog.primary.confirm' | t"
  [secondaryLabel]="'dialog.secondary.cancel' | t"
  (primary)="confirmDelete()">
  <p>{{ 'dialog.body.delete' | t }}</p>
</app-dialog>
```

**Sugestão de chaves (PT‑BR/EN):**  
```ts
// SELECTOR: COMMON/ DIALOG
'dialog.open':              { pt: 'Abrir diálogo',           en: 'Open dialog' },
'dialog.title.delete':      { pt: 'Confirmar exclusão',      en: 'Confirm delete' },
'dialog.body.delete':       { pt: 'Tem certeza? Esta ação não pode ser desfeita.',
                              en: 'Are you sure? This action cannot be undone.' },
'dialog.primary.confirm':   { pt: 'Confirmar',               en: 'Confirm' },
'dialog.secondary.cancel':  { pt: 'Cancelar',                en: 'Cancel' },
```

### 2) Ações customizadas

```html
<app-dialog
  [title]="'dialog.title.delete' | t"
  size="md"
  [(opened)]="openDlg">
  <p>{{ 'dialog.body.delete' | t }}</p>

  <div dialog-actions>
    <button class="btn--ghost btn" type="button" (click)="openDlg=false">
      {{ 'dialog.secondary.cancel' | t }}
    </button>
    <button class="btn" type="button" (click)="confirmDelete()">
      {{ 'dialog.primary.confirm' | t }}
    </button>
  </div>
</app-dialog>
```

### 3) Tamanhos

```html
<app-dialog title="SM" size="sm" [(opened)]="o1"><p>Conteúdo…</p></app-dialog>
<app-dialog title="MD" size="md" [(opened)]="o2"><p>Conteúdo…</p></app-dialog>
<app-dialog title="LG" size="lg" [(opened)]="o3"><p>Conteúdo…</p></app-dialog>
<app-dialog title="Auto" size="auto" [(opened)]="o4"><p style="width:48ch">Adapta ao conteúdo.</p></app-dialog>
```

---

## Boas práticas

- Prefira textos curtos no cabeçalho e botões.
- Para formulários, mantenha o foco no primeiro campo interativo após abrir.
- Evite conteúdo muito alto; rolagem vertical é suportada no corpo.
- Em mobile (≤ 480px) o dialog usa largura total e respeita `safe‑area` (seu Sass já cobre).

---

## Troubleshooting

- **“ResizeObserver is not defined”** em SSR: proteja acesso com checagem de `window`/`ResizeObserver` antes de instanciar. O componente já faz *guard*, mas em ambientes sem `DOM` garanta que rode só no browser.
- **Foco não prende no diálogo**: verifique se nenhum elemento dentro do dialog tem `tabindex="-1"` indevidamente ou `autofocus` roubando foco.
