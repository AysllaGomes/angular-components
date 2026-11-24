/**
 * Comportamento comum de painéis modais (Dialog, ActionBar) ao abrir e fechar:
 *
 * - **foco**: guarda o elemento focado ao abrir e o devolve ao fechar
 *   (se ainda estiver na página);
 * - **scroll**: trava a rolagem do `<body>` enquanto houver algum modal aberto (a pilha
 *   guarda o valor original no primeiro e o devolve quando o último fecha);
 * - **fundo inerte**: marca com `inert` os irmãos do host e de cada ancestral até
 *   o `<body>`, então o resto da página não recebe foco, clique nem leitor de tela;
 * - **teclado** (`handleKeydown`): Esc fecha e Tab circula dentro do painel. Com um
 *   modal aberto sobre outro (um Dialog de confirmação sobre uma ActionBar), só o de
 *   cima responde; e um Esc já tratado dentro dele (fechar um Select aberto) não fecha
 *   o modal junto.
 *
 * Só desfaz o que ela mesma fez: elementos que já eram `inert` continuam inertes, e
 * o `overflow` do body volta ao valor anterior. Elementos com o atributo
 * `data-dialog-keep-active` (ex.: o container de toasts) nunca ficam inertes.
 *
 * Seguro em SSR: sem `document`, não faz nada.
 */
export class ModalSession {
  /** modais abertos, do mais antigo ao mais recente: o último é o de cima */
  private static readonly stack: ModalSession[] = [];
  /** `overflow` do body antes do primeiro modal da pilha */
  private static bodyOverflow = '';

  private active = false;
  private returnFocusTo: HTMLElement | null = null;
  private inerted: HTMLElement[] = [];
  /** o host (ou um ancestral) que um modal de baixo tinha deixado inerte: reativado enquanto este estiver aberto */
  private revived: HTMLElement[] = [];

  /** @param host elemento do componente; tudo fora dele vira fundo inerte */
  constructor(private readonly host: HTMLElement) {}

  get isActive() { return this.active; }

  /** é o modal de cima (o que recebe Esc e Tab) */
  get isTop() { return this.active && ModalSession.stack.at(-1) === this; }

  open() {
    if (this.active || typeof document === 'undefined') return;
    this.active = true;

    // aberto sobre outro modal: o de baixo deixou inerte tudo fora dele, talvez este
    // host também (ex.: um Dialog de confirmação ao lado de uma ActionBar aberta)
    for (const below of ModalSession.stack) {
      for (const el of below.inerted) {
        if (el.contains(this.host) && el.hasAttribute('inert')) {
          el.removeAttribute('inert');
          this.revived.push(el);
        }
      }
    }
    if (ModalSession.stack.length === 0) {
      ModalSession.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    ModalSession.stack.push(this);

    const focused = document.activeElement;
    this.returnFocusTo = focused instanceof HTMLElement && focused !== document.body ? focused : null;

    this.makeBackgroundInert();
  }

  /** @param restoreFocus `false` ao destruir o componente (não rouba o foco da página) */
  close(restoreFocus = true) {
    if (!this.active) return;
    this.active = false;
    const i = ModalSession.stack.indexOf(this);
    const above = i >= 0 ? ModalSession.stack.slice(i + 1) : [];
    if (i >= 0) ModalSession.stack.splice(i, 1);

    // o último a fechar devolve a rolagem (fechar vários juntos, em qualquer ordem, não trava a página)
    if (ModalSession.stack.length === 0) document.body.style.overflow = ModalSession.bodyOverflow;

    for (const el of this.inerted) el.removeAttribute('inert');
    this.inerted = [];

    // o que este reativou volta a ser fundo do modal de baixo, se ele continua aberto
    for (const el of this.revived) {
      if (ModalSession.stack.some(s => s.inerted.includes(el))) el.setAttribute('inert', '');
    }
    this.revived = [];

    const el = this.returnFocusTo;
    this.returnFocusTo = null;
    if (above.length) {
      // fechou com outro modal ainda por cima (ex.: confirmar fecha o painel e o Dialog
      // juntos): o foco não vai para o fundo agora; quem abriu o de cima de dentro deste
      // painel herda o destino deste, para o foco terminar onde a sequência começou
      for (const s of above) {
        if (s.returnFocusTo && this.host.contains(s.returnFocusTo)) s.returnFocusTo = el;
      }
      return;
    }
    if (restoreFocus && el?.isConnected) el.focus();
  }

  /**
   * Teclado do modal (chame do `keydown` do documento). Só age no modal de cima:
   * - **Esc** fecha, a não ser que alguém dentro dele já tenha tratado a tecla
   *   (`preventDefault`, ex.: Select ou TreeSelect fechando o painel);
   * - **Tab** circula entre os elementos focáveis de `root`, e traz de volta o foco
   *   que estiver fora dele.
   */
  handleKeydown(e: KeyboardEvent, root: HTMLElement | null | undefined, close: () => void) {
    if (!this.isTop) return;
    if (e.key === 'Escape') {
      if (e.defaultPrevented) return;
      e.preventDefault();
      close();
    } else if (e.key === 'Tab' && root) {
      trapFocus(e, root);
    }
  }

  private makeBackgroundInert() {
    let node: HTMLElement | null = this.host;
    while (node && node !== document.body && node.parentElement) {
      for (const sib of Array.from(node.parentElement.children)) {
        if (sib === node || !(sib instanceof HTMLElement) || sib.hasAttribute('inert')) continue;
        if (sib.hasAttribute('data-dialog-keep-active')) continue;
        if (sib.tagName === 'SCRIPT' || sib.tagName === 'STYLE') continue;
        sib.setAttribute('inert', '');
        this.inerted.push(sib);
      }
      node = node.parentElement;
    }
  }
}

const FOCUSABLE = [
  'a[href]', 'area[href]', 'button', 'input', 'select', 'textarea', 'iframe', 'summary',
  '[contenteditable]:not([contenteditable="false"])', '[tabindex]',
].join(', ');

/** elementos que o Tab alcança dentro de `root`, na ordem do documento */
function tabbables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(n =>
    n.tabIndex >= 0 &&
    !(n as HTMLButtonElement).disabled &&
    !(n instanceof HTMLInputElement && n.type === 'hidden') &&
    !n.closest('[inert], [hidden]')
  );
}

function trapFocus(e: KeyboardEvent, root: HTMLElement) {
  const list = tabbables(root);
  if (!list.length) { e.preventDefault(); return; }
  const first = list[0], last = list[list.length - 1];
  const active = root.ownerDocument.activeElement;
  // foco fora do painel (ex.: clicou no fundo antes de ele ficar inerte): volta para dentro
  if (!active || !root.contains(active)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
  if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
}
