# Dialog

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Sheet/modal acessível e leve para confirmações e pequenos formulários. Construído com **Angular Standalone + HTML/Sass**, sem dependências de UI libs.

- **Arquivo:** `src/app/shared/components/dialog/dialog.component.ts`
- **Estilos:** `src/app/shared/components/dialog/dialog.component.sass`
- **Padrões:** segue tokens de tema (CSS Custom Properties) e herda “accent”.

---

## Por que existe

Um modal precisa de mais do que uma caixa por cima da página: foco que entra, fica preso dentro e volta ao botão que abriu, `Esc` para fechar, fundo inerte para o leitor de tela e título ligado ao diálogo. Esquecer qualquer um deixa quem usa teclado ou leitor de tela perdido. Este componente faz isso sozinho, com tamanhos e ações padrão.

## Quando usar

### Use quando

- A pessoa precisa confirmar uma ação antes de seguir (excluir, descartar alterações).
- Um formulário pequeno que não justifica trocar de página.
- A tarefa deve ser resolvida antes de voltar ao resto da tela.

### Prefira outro

- Formulário ou revisão mais longos, ao lado do conteúdo: use o [ActionBar](../actionbar/actionbar.md).
- Avisar que algo aconteceu, sem interromper: use o [Toast](../toast/toast.md).
- Uma explicação curta sobre um elemento: use o [Tooltip](../tooltip/tooltip.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Dialog em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/dialog/` |
| Arquivos auxiliares | `a11y/modal-session.ts` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/common`, `@angular/core`. Ao todo: 7 arquivos, ~739 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Uso

```html
<button appButton type="button" (click)="aberto = true">Excluir pedido</button>

<app-dialog
  title="Excluir pedido?"
  [(opened)]="aberto"
  describedBy="excluir-desc"
  primaryLabel="Excluir"
  secondaryLabel="Cancelar"
  (primary)="excluir()">
  <p id="excluir-desc">Esta ação não pode ser desfeita.</p>
</app-dialog>
```

Ao fechar, o foco volta ao botão "Excluir pedido". Para textos traduzidos, passe as strings do seu i18n nos inputs.

## API

### Inputs

| Propriedade       | Tipo                             | Padrão       | Descrição                                                               |
|-------------------|----------------------------------|--------------|-------------------------------------------------------------------------|
| `title`           | `string`                         | `'Dialog'`   | Título mostrado no cabeçalho.                                           |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'auto'` | `'md'` | Largura do dialog. `auto` mede o conteúdo ao abrir (via `ResizeObserver`) e escolhe entre `sm`…`xl`. |
| `opened`          | `boolean`                        | `false`      | Controla abertura. Suporta two‑way via `[(opened)]`.                    |
| `closeOnBackdrop` | `boolean`                        | `true`       | Fecha ao clicar no backdrop.                                            |
| `describedBy`     | `string \| null`                 | `null`       | Id (ou ids separados por espaço) do texto que descreve o dialog → `aria-describedby`. |
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
- `aria-describedby` (opcional, via `describedBy`) aponta para o texto que descreve o dialog, lido junto com o título ao abrir.
- **Foco inicial** vai para o botão “fechar”. **Trap de foco** mantém a navegação dentro do diálogo.
- **Foco devolvido**: ao fechar (botão, `Esc`, backdrop ou `opened=false`), o foco volta ao elemento que estava focado antes de abrir — normalmente o botão que abriu —, se ele ainda estiver na página.
- **Fundo inerte**: enquanto aberto, o resto da página recebe `inert` (sem foco, clique ou leitura por leitor de tela). Ao fechar, só os elementos marcados pelo dialog são liberados (o que já era `inert` continua). Para manter algo ativo — como avisos —, use o atributo `data-dialog-keep-active` nesse elemento; o `app-toast-container` já vem com ele.
- **Teclado:** `Esc` fecha; `Tab`/`Shift+Tab` navega entre itens focáveis.
- **Um modal sobre outro** (ex.: um Dialog de confirmação aberto a partir de uma ActionBar, ou o contrário): só o de cima responde a `Esc` e `Tab`; cada `Esc` fecha um, de cima para baixo. O de cima continua usável mesmo sendo irmão do de baixo (que tinha deixado o resto da página inerte), e ao fechar volta a ser fundo dele.
- **`Esc` já tratado dentro do modal** não fecha o modal: fechar um Select, TreeSelect ou Tooltip aberto dentro dele fecha só o painel.
- **Backdrop:** habilitado por padrão; pode ser desativado com `closeOnBackdrop=false`.

---

## Tokens (CSS Custom Properties)

O Dialog utiliza tokens próprios; todos possuem valores por tema (claro/escuro) e respeitam o `--accent`. As ações usam `--accent-fill` (fundo da principal, com texto branco) e `--accent-text` (texto da secundária), para manter 4,5:1 com qualquer cor de destaque.

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

### 1) Básico

```html
<button appButton type="button" (click)="openDlg = true">Excluir pedido</button>

<app-dialog
  title="Excluir pedido?"
  size="auto"
  [(opened)]="openDlg"
  describedBy="dlg-delete-desc"
  primaryLabel="Excluir"
  secondaryLabel="Cancelar"
  (primary)="confirmDelete()">
  <p id="dlg-delete-desc">Esta ação não pode ser desfeita.</p>
</app-dialog>
```

> Os textos são os da sua app, já no idioma dela (texto fixo, o pipe de tradução que você usa ou um signal). O botão de fechar (×) usa `labels.close` de [`provideUiLabels`](../../labels/labels.md).

### 2) Ações customizadas

```html
<app-dialog
  title="Excluir pedido?"
  size="md"
  [(opened)]="openDlg">
  <p>Esta ação não pode ser desfeita.</p>

  <div dialog-actions>
    <button class="btn--ghost btn" type="button" (click)="openDlg=false">
      Cancelar
    </button>
    <button class="btn" type="button" (click)="confirmDelete()">
      Excluir
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
- Em mobile (≤ 480px) o dialog usa largura total.

---

## Troubleshooting

- **“ResizeObserver is not defined”** em SSR: proteja acesso com checagem de `window`/`ResizeObserver` antes de instanciar. O componente já faz *guard*, mas em ambientes sem `DOM` garanta que rode só no browser.
- **Foco não prende no diálogo**: verifique se nenhum elemento dentro do dialog tem `tabindex="-1"` indevidamente ou `autofocus` roubando foco.

---

## Roadmap

### Agora (0.x)
- [ ] **A11y**
  - [x] Retornar o foco ao elemento que abriu o diálogo (focus restore).
  - [x] `aria-describedby` opcional (input `describedBy`).
  - [x] Tornar o *backdrop* realmente inerte ao foco (`inert` no conteúdo por trás).
- [ ] **API de estado**
  - [ ] Eventos `afterOpen` / `afterClose` (disparam após a animação).
  - [ ] Evento `beforeClose` cancelável (`(beforeClose)="e.preventDefault()"`).
  - [ ] Inputs para *busy state* dos botões: `primaryBusy`, `secondaryBusy`.
- [ ] **UX**
  - [ ] Variante “destrutiva” (`[destructive]="true"`) que muda *tone* do primário.
  - [ ] `autofocus` inteligente no primeiro controle interativo do corpo.
  - [ ] *Sticky footer* opt-in (`[stickyFooter]="true"`).
- [ ] **Responsividade**
  - [ ] Novo tamanho `full` (tela cheia em mobile).
  - [ ] *Safe areas* iOS com `env(safe-area-inset-*)`.
- [ ] **Perf/SSR**
  - [x] *Guard* adicional para `ResizeObserver`/DOM (SSR).
  - [x] Não renderizar nós internos quando `opened=false` (`@if`).

### Próximo (1.0)
- [ ] **Serviço programático**
  - [ ] `DialogService.open(content, config): DialogRef<T>`
  - [ ] `DialogRef` com `close(result?)`, `afterClosed$`, `backdropClick$`.
  - [ ] Suporte a *TemplateRef* e componentes dinâmicos.
- [ ] **Empilhamento**
  - [ ] Gerenciador de z-index e foco para múltiplos diálogos.
  - [x] Fechar em cascata com *Esc* respeitando o topo.
- [ ] **Form helpers**
  - [ ] `submitOnEnter` (Enter confirma se o formulário é válido).
  - [ ] `disablePrimaryWhenInvalid` com *FormGroup* injetável.
- [ ] **Tematização**
  - [ ] Mais tokens: `--dlg-radius`, `--dlg-gap`, `--dlg-duration`, `--dlg-ease`.
  - [ ] *Tokens* para ícones/cores de variante destrutiva.

### Depois (1.x+)
- [ ] **Animações e motion**
  - [ ] Respeitar `prefers-reduced-motion` (reduzir/omitir transições).
  - [ ] APIs de transição (enter/exit) configuráveis.
- [ ] **Acessibilidade avançada**
  - [ ] Suporte a `aria-live` para avisos dentro do corpo.
  - [ ] Expor utilitário para gerenciar leitura por leitores de tela.
- [ ] **Testes & Docs**
  - [ ] Testes de foco/trap com *Harness*.
  - [ ] Exemplos: formulário, confirmação destrutiva, diálogo de seleção, carregamento assíncrono.
