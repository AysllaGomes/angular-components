<p align="right"><a href="./actionbar.en.md">English</a></p>

# ActionBar

Sheet lateral com título, conteúdo e ações. Abre da **direita para a esquerda**, herda as cores do tema atual e respeita o **accent**.

> **Quando usar**
>
> - Fluxos de confirmação/edição que não justificam trocar de rota.
> - Wizards curtos, revisões e formulários auxiliares.
> - Evite para conteúdo muito longo ou navegação completa (prefira uma página).

---

## Anatomia
1. **Backdrop** (click‑to‑close opcional).
2. **Header** com título e botão de fechar.
3. **Content** rolável.
4. **Footer** com ações (primária/ secundária) – responsivo.

---

## API

### Selector
```html
<app-actionbar></app-actionbar>
```

### Inputs
| Input             | Tipo                             | Default         | Descrição                                             |
|-------------------|----------------------------------|-----------------|-------------------------------------------------------|
| `title`           | `string`                         | `'ActionBar'`   | Título exibido no header.                             |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'auto'` | `'auto'`        | Largura do sheet. `auto` usa o conteúdo para decidir. |
| `closeOnBackdrop` | `boolean`                        | `true`          | Fecha ao clicar no backdrop.                          |
| `primaryLabel`    | `string \| null`                 | `null`          | Texto do botão primário (mostra se definido).         |
| `secondaryLabel`  | `string \| null`                 | `null`          | Texto do botão secundário (mostra se definido).       |
| `opened`          | `boolean`                        | `false`         | Controla a abertura. Use `[(opened)]` para two‑way.   |

### Outputs
| Output         | Tipo                    | Dispara quando                      |
|----------------|-------------------------|-------------------------------------|
| `primary`      | `EventEmitter<void>`    | Clicar no botão primário.           |
| `secondary`    | `EventEmitter<void>`    | Clicar no botão secundário.         |
| `openedChange` | `EventEmitter<boolean>` | Estado abre/fecha (para two‑way).   |

### Métodos públicos
| Método       | Descrição           |
|--------------|---------------------|
| `openBar()`  | Abre a ActionBar.   |
| `close()`    | Fecha a ActionBar.  |

---

## Acessibilidade

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` amarrado ao título.
- **Teclado:** `Esc` fecha; Tab mantém o foco preso dentro do sheet (focus‑trap).
- **Foco inicial:** ao abrir, o foco vai para o botão de fechar.
- Botões possuem **focus-visible** de alto contraste.

---

## Tamanhos
- `sm` — até **360px**.  
- `md` — até **640px**.  
- `lg` — até **960px**.  
- `auto` — mede o `scrollWidth` do conteúdo (via `ResizeObserver`) e escolhe: `<420 → sm`, `<720 → md`, caso contrário `lg`.

> **Nota:** se `ResizeObserver` não existir (SSR/ambiente antigo), o componente cai em `md`.

---

## Theming
O componente usa os tokens globais:

- Fundo / texto / bordas: `--surface`, `--fg`, `--border`  
- Acento e realces: `--accent`  
- Botões e _hover/focus_ são **accent-aware** por padrão.

Não há tokens exclusivos da ActionBar; ela segue o mesmo esquema do restante do projeto.

---

## Exemplos

### Básico
```html
<app-actionbar
  [title]="'Título do actionbar'"
  size="md"
  [(opened)]="open"
  primaryLabel="Confirmar"
  secondaryLabel="Cancelar"
  (primary)="onConfirm()"
  (secondary)="open=false">
  <!-- seu conteúdo -->
</app-actionbar>
```

### Automático (adapta à largura do conteúdo)
```html
<app-actionbar
  [title]="'Revisão'"
  size="auto"
  [(opened)]="openAuto"
  primaryLabel="Ok">
  <div style="width:min(60ch,100%);height:36vh">...</div>
</app-actionbar>
```

### Sem fechar no backdrop
```html
<app-actionbar
  [title]="'Termo'"
  [closeOnBackdrop]="false"
  [(opened)]="openTerms">
  ...
</app-actionbar>
```

### Ações customizadas (sem usar `primaryLabel/secondaryLabel`)
Projete seus botões no footer (slot padrão já inclui a área). Basta esconder os padrões deixando os labels `null` e renderizar ações no conteúdo.

---

## Boas práticas
- Prefira textos curtos no título.
- Mantenha no máximo **duas** ações no footer; extras podem ir dentro do conteúdo.
- Não esconda a rolagem do conteúdo.
- Se a ação for destrutiva, confirme novamente dentro do conteúdo.
