import { DestroyRef, Directive, ElementRef, HostBinding, booleanAttribute, computed, inject, input } from '@angular/core';

import { BtnTone, BtnSize, BtnVariant } from './button.types';

@Directive({
  // pode ser usado em <button> e <a>
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective {
  /** Forma 1: appButton="ghost" ou atributo vazio <button appButton> */
  readonly appButton = input<BtnVariant | '' | null | undefined>(undefined);

  /** Forma 2: variant="ghost" (tem prioridade sobre a forma 1) */
  readonly variantInput = input<BtnVariant | null | undefined>(undefined, { alias: 'variant' });

  /** Variant efetivo; "", null ou undefined (atributo vazio) caem em 'solid' */
  readonly variant = computed<BtnVariant>(() => this.variantInput() || this.appButton() || 'solid');

  /** Paleta (accent/neutral/danger) */
  readonly tone = input<BtnTone>('accent');
  /** Tamanho */
  readonly size = input<BtnSize>('md');
  /** Largura total */

  /** Flags booleanas com coerção de atributo */
  readonly block = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly busy = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // desabilitado/ocupado: o clique não chega a ninguém. Na fase de captura, porque os
    // listeners comuns do mesmo elemento ((click) do template, routerLink) rodam na ordem
    // em que foram registrados, e os deles vêm antes do HostListener desta diretiva.
    const host = this.el.nativeElement;
    const block = (e: Event) => {
      if (this.disabled() || this.busy()) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    host.addEventListener('click', block, { capture: true });
    inject(DestroyRef).onDestroy(() => host.removeEventListener('click', block, { capture: true }));
  }

  private get isButton() {
    return this.el.nativeElement.tagName.toLowerCase() === 'button';
  }

  // ===== A11y / estados =====
  @HostBinding('attr.aria-busy') get ariaBusy() { return this.busy() ? 'true' : null; }

  @HostBinding('attr.disabled') get attrDisabled() {
    return this.isButton && (this.disabled() || this.busy()) ? '' : null;
  }
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return !this.isButton && (this.disabled() || this.busy()) ? 'true' : null;
  }
  @HostBinding('attr.tabindex') get tabIndex() {
    return !this.isButton && (this.disabled() || this.busy()) ? -1 : null;
  }

  // ===== classes =====
  @HostBinding('class.btn') base = true;

  @HostBinding('class.btn--solid')   get cSolid()   { return this.variant() === 'solid'; }
  @HostBinding('class.btn--ghost')   get cGhost()   { return this.variant() === 'ghost'; }
  @HostBinding('class.btn--outline') get cOutline() { return this.variant() === 'outline'; }
  @HostBinding('class.btn--pill')    get cPill()    { return this.variant() === 'pill'; }
  @HostBinding('class.btn--link')    get cLink()    { return this.variant() === 'link'; }

  @HostBinding('class.btn--accent')  get tAccent()  { return this.tone() === 'accent'; }
  @HostBinding('class.btn--neutral') get tNeutral() { return this.tone() === 'neutral'; }
  @HostBinding('class.btn--danger')  get tDanger()  { return this.tone() === 'danger'; }

  @HostBinding('class.btn--xs')      get sXs()      { return this.size() === 'xs'; }
  @HostBinding('class.btn--sm')      get sSm()      { return this.size() === 'sm'; }
  @HostBinding('class.btn--md')      get sMd()      { return this.size() === 'md'; }
  @HostBinding('class.btn--lg')      get sLg()      { return this.size() === 'lg'; }

  @HostBinding('class.btn--block')   get cBlock()   { return this.block(); }
  @HostBinding('class.btn--icononly') get cIcon()   { return this.iconOnly(); }
  @HostBinding('class.is-busy')      get cBusy()    { return this.busy(); }
}
