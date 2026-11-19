/**
 * Comportamento comum de painéis modais (Dialog, ActionBar) ao abrir e fechar:
 *
 * - **foco**: guarda o elemento focado ao abrir e o devolve ao fechar
 *   (se ainda estiver na página);
 * - **scroll**: trava a rolagem do `<body>` enquanto aberto;
 * - **fundo inerte**: marca com `inert` os irmãos do host e de cada ancestral até
 *   o `<body>`, então o resto da página não recebe foco, clique nem leitor de tela.
 *
 * Só desfaz o que ela mesma fez: elementos que já eram `inert` continuam inertes, e
 * o `overflow` do body volta ao valor anterior. Elementos com o atributo
 * `data-dialog-keep-active` (ex.: o container de toasts) nunca ficam inertes.
 *
 * Seguro em SSR: sem `document`, não faz nada.
 */
export class ModalSession {
  private active = false;
  private returnFocusTo: HTMLElement | null = null;
  private prevOverflow = '';
  private inerted: HTMLElement[] = [];

  /** @param host elemento do componente; tudo fora dele vira fundo inerte */
  constructor(private readonly host: HTMLElement) {}

  get isActive() { return this.active; }

  open() {
    if (this.active || typeof document === 'undefined') return;
    this.active = true;

    const focused = document.activeElement;
    this.returnFocusTo = focused instanceof HTMLElement && focused !== document.body ? focused : null;

    this.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    this.makeBackgroundInert();
  }

  /** @param restoreFocus `false` ao destruir o componente (não rouba o foco da página) */
  close(restoreFocus = true) {
    if (!this.active) return;
    this.active = false;

    document.body.style.overflow = this.prevOverflow;

    for (const el of this.inerted) el.removeAttribute('inert');
    this.inerted = [];

    const el = this.returnFocusTo;
    this.returnFocusTo = null;
    if (restoreFocus && el?.isConnected) el.focus();
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
