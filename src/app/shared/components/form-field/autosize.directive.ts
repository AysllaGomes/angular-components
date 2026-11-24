import { DestroyRef, Directive, ElementRef, afterNextRender, effect, inject, input, numberAttribute } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * `<textarea>` que cresce com o texto: a altura acompanha o conteúdo até `maxRows`
 * linhas e, dali em diante, o campo rola. A altura mínima é a do CSS (ou `rows`).
 *
 * ```html
 * <textarea appAutosize formControlName="obs"></textarea>      <!-- até 8 linhas -->
 * <textarea appAutosize="4" formControlName="obs"></textarea>  <!-- até 4 -->
 * ```
 *
 * Acompanha a digitação, o valor vindo do formulário (`setValue`, `reset`, `ngModel`) e a
 * largura do campo (o texto quebra em mais ou menos linhas).
 */
@Directive({
  selector: 'textarea[appAutosize]',
  standalone: true,
  host: {
    '(input)': 'resize()',
    // a altura é dela: o puxador manual brigaria com o tamanho automático
    '[style.resize]': '"none"',
  },
})
export class AutosizeDirective {
  /** máximo de linhas antes de rolar (atributo vazio = 8; 0 = sem limite) */
  readonly maxRows = input(8, {
    alias: 'appAutosize',
    transform: (v: unknown) => (v === '' || v === null || v === undefined ? 8 : numberAttribute(v, 8)),
  });

  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef).nativeElement;
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.resize();
      // valor escrito pelo formulário não dispara `input`; aqui o FormControl do binding já
      // está ligado (no construtor, o valueChanges ainda não existe)
      const sub = this.ngControl?.valueChanges?.subscribe(() => queueMicrotask(() => this.resize()));
      destroyRef.onDestroy(() => sub?.unsubscribe());
      // largura mudou (janela, layout): o texto quebra diferente
      if (typeof ResizeObserver === 'undefined') return;
      let width = this.el.clientWidth;
      const ro = new ResizeObserver(() => {
        if (this.el.clientWidth === width) return;
        width = this.el.clientWidth;
        this.resize();
      });
      ro.observe(this.el);
      destroyRef.onDestroy(() => ro.disconnect());
    });

    // trocar o máximo refaz a conta
    effect(() => { this.maxRows(); queueMicrotask(() => this.resize()); });
  }

  resize() {
    const el = this.el;
    if (!el.isConnected || typeof getComputedStyle === 'undefined') return;
    const cs = getComputedStyle(el);
    const px = (v: string) => parseFloat(v) || 0;
    const line = px(cs.lineHeight) || px(cs.fontSize) * 1.4;
    const border = px(cs.borderTopWidth) + px(cs.borderBottomWidth);
    const box = px(cs.paddingTop) + px(cs.paddingBottom) + border;
    const max = this.maxRows() > 0 ? line * this.maxRows() + box : Infinity;

    el.style.height = 'auto'; // mede do zero (senão nunca encolhe)
    const needed = el.scrollHeight + border;
    el.style.height = `${Math.min(needed, max)}px`;
    el.style.overflowY = needed > max ? 'auto' : 'hidden';
  }
}
