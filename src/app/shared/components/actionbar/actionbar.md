<p align="right"><a href="./actionbar.en.md">English</a></p>

# ActionBar

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Sheet lateral com título, conteúdo e ações. Abre da **direita para a esquerda**, herda as cores do tema atual e respeita o **accent**.

---

## Por que existe

Painéis laterais têm os mesmos cuidados de um modal (foco preso e devolvido, `Esc`, fundo inerte, rolagem da página travada) e ainda precisam de largura que se adapte ao conteúdo. Este componente resolve isso uma vez, com título, conteúdo rolável e ações fixas no rodapé.

## Quando usar

### Use quando

- Fluxos de revisão, confirmação ou edição que não justificam trocar de rota.
- Formulários auxiliares e wizards curtos, mantendo a tela de origem à vista.
- O conteúdo é maior do que cabe confortavelmente num Dialog.

### Prefira outro

- Uma confirmação curta: use o [Dialog](../dialog/dialog.md).
- Conteúdo muito longo ou navegação completa: use uma página.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o ActionBar em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/actionbar/` |
| Componentes que ele usa | `components/button/` |
| Arquivos auxiliares | `a11y/modal-session.ts` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/button/button' as *
```

Depende só de `@angular/core`. Ao todo: 10 arquivos, ~991 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

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
| `primary`      | `void`                  | Clicar no botão primário.           |
| `secondary`    | `void`                  | Clicar no botão secundário.         |
| `openedChange` | `boolean`               | O painel abre/fecha por conta própria (ESC, backdrop, ×, `openBar()`/`close()`). Parte do `[(opened)]`; não dispara quando o pai muda `[opened]`. |

### Métodos públicos
| Método       | Descrição           |
|--------------|---------------------|
| `openBar()`  | Abre a ActionBar.   |
| `close()`    | Fecha a ActionBar.  |

---

## Acessibilidade

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` amarrado ao título.
- **Teclado:** `Esc` fecha; Tab mantém o foco preso dentro do sheet (focus‑trap).
- **Um modal sobre outro** (ex.: um Dialog de confirmação aberto a partir de uma ActionBar, ou o contrário): só o de cima responde a `Esc` e `Tab`; cada `Esc` fecha um, de cima para baixo. O de cima continua usável mesmo sendo irmão do de baixo (que tinha deixado o resto da página inerte), e ao fechar volta a ser fundo dele.
- **`Esc` já tratado dentro do modal** não fecha o modal: fechar um Select, TreeSelect ou Tooltip aberto dentro dele fecha só o painel.
- **Foco inicial:** ao abrir, o foco vai para o botão de fechar.
- **Foco devolvido:** ao fechar (botão, `Esc`, backdrop ou `opened=false`), o foco volta ao elemento que estava focado antes de abrir (normalmente o botão que abriu), se ele ainda estiver na página.
- **Fundo inerte e sem rolagem:** enquanto aberto, a rolagem da página trava e o resto da página recebe `inert` (sem foco, clique ou leitor de tela). Ao fechar, só o que o painel marcou é liberado. Elementos com `data-dialog-keep-active` continuam ativos (o `app-toast-container` já vem com ele).
- Botões possuem **focus-visible** de alto contraste.

---

## Tamanhos
- `sm` — até **360px**.  
- `md` — até **640px**.  
- `lg` — até **960px**.  
- `auto` — mede o `scrollWidth` do conteúdo (via `ResizeObserver`) e escolhe: `<436 → sm`, `<720 → md`, caso contrário `lg`.

> **Nota:** se `ResizeObserver` não existir (SSR/ambiente antigo), o componente cai em `md`.

---

## Theming
O componente usa os tokens globais:

- Fundo / texto / bordas: `--surface`, `--fg`, `--border`  
- Acento e realces: `--accent`; ações com `--accent-fill` (fundo da principal, texto branco) e `--accent-text` (secundária), para manter 4,5:1  
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
