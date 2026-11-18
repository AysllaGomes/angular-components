/**
 * O jsdom (ambiente dos testes no Vitest) não calcula layout: `scrollWidth`
 * é sempre 0 e não existe `ResizeObserver`. Este helper simula os dois para
 * testar o tamanho `auto` do Dialog/ActionBar:
 *
 * - `scrollWidth` de um elemento = maior largura inline (`style.width`) dos filhos;
 * - `ResizeObserver` dispara o callback logo após `observe()`, como no navegador.
 *
 * Assim os testes continuam verificando a ligação real (observar o conteúdo ao
 * abrir, religar ao reabrir), sem depender do CSS.
 */
export function stubLayout(): () => void {
  const proto = HTMLElement.prototype;

  Object.defineProperty(proto, 'scrollWidth', {
    configurable: true,
    get(this: HTMLElement) {
      const widths = Array.from(this.children).map(c => parseFloat((c as HTMLElement).style.width) || 0);
      return Math.max(0, ...widths);
    }
  });

  class FakeResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe() { queueMicrotask(() => this.callback([], this as unknown as ResizeObserver)); }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);

  return () => {
    // remove a propriedade própria e volta a valer a do Element.prototype
    delete (proto as { scrollWidth?: number }).scrollWidth;
    vi.unstubAllGlobals();
  };
}
