import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

import { BtnTone } from '../../model/type/button/bnt-tone.type';
import { BtnSize } from '../../model/type/button/bnt-size.type';
import { BtnVariant } from '../../model/type/button/bnt-variant.type';

@Directive({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
})
export class ButtonDirective {
  /** Visual (solid/ghost/outline/pill/link) */
  @Input('appButton') variant: BtnVariant = 'solid';
  /** Paleta (accent/neutral/danger) */
  @Input() tone: BtnTone = 'accent';
  /** Tamanho */
  @Input() size: BtnSize = 'md';
  /** Largura total */
  @Input() block = false;
  /** Somente ícone (quadrado) */
  @Input() iconOnly = false;
  /** Estado ocupado (desabilita e mostra spinner) */
  @Input() busy = false;
  /** Disabled explícito */
  @Input() disabled = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  private get isButton() {
    return this.el.nativeElement.tagName.toLowerCase() === 'button';
  }

  // ===== Acessibilidade / estados =====
  @HostBinding('attr.aria-busy') get ariaBusy() { return this.busy ? 'true' : null; }

  @HostBinding('attr.disabled') get attrDisabled() {
    return this.isButton && (this.disabled || this.busy) ? '' : null;
  }
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return !this.isButton && (this.disabled || this.busy) ? 'true' : null;
  }
  @HostBinding('attr.tabindex') get tabIndex() {
    return !this.isButton && (this.disabled || this.busy) ? -1 : null;
  }

  @HostListener('click', ['$event'])
  onClick(e: Event) {
    if (this.disabled || this.busy) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  // ===== classes =====
  @HostBinding('class.btn') base = true;

  @HostBinding('class.btn--solid')  get cSolid()  { return this.variant === 'solid'; }
  @HostBinding('class.btn--ghost')  get cGhost()  { return this.variant === 'ghost'; }
  @HostBinding('class.btn--outline')get cOutline(){ return this.variant === 'outline'; }
  @HostBinding('class.btn--pill')   get cPill()   { return this.variant === 'pill'; }
  @HostBinding('class.btn--link')   get cLink()   { return this.variant === 'link'; }

  @HostBinding('class.btn--accent') get tAccent() { return this.tone === 'accent'; }
  @HostBinding('class.btn--neutral')get tNeutral(){ return this.tone === 'neutral'; }
  @HostBinding('class.btn--danger') get tDanger() { return this.tone === 'danger'; }

  @HostBinding('class.btn--sm')     get sSm()     { return this.size === 'sm'; }
  @HostBinding('class.btn--md')     get sMd()     { return this.size === 'md'; }
  @HostBinding('class.btn--lg')     get sLg()     { return this.size === 'lg'; }

  @HostBinding('class.btn--block')  get cBlock()  { return this.block; }
  @HostBinding('class.btn--icononly') get cIcon() { return this.iconOnly; }
  @HostBinding('class.is-busy')     get cBusy()   { return this.busy; }
}
