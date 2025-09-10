import { Directive, ElementRef, HostBinding, HostListener, Input, booleanAttribute } from '@angular/core';

import { BtnTone } from '../../model/type/button/bnt-tone.type';
import { BtnSize } from '../../model/type/button/bnt-size.type';
import { BtnVariant } from '../../model/type/button/bnt-variant.type';

@Directive({
  // pode ser usado em <button> e <a>
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective {
  /** Estado interno do variant (com fallback) */
  private _variant: BtnVariant = 'solid';

  /** Forma 1: [appButton]="'ghost'" ou atributo vazio <button appButton>  */
  @Input('appButton') set appButtonInput(v: BtnVariant | '' | null | undefined) {
    // se vier "", null ou undefined (caso do atributo vazio), cai no 'solid'
    this._variant = (v && String(v).length ? v as BtnVariant : 'solid');
  }

  /** Forma 2: variant="ghost" (azuleja a propriedade explicitamente) */
  @Input() set variant(v: BtnVariant | null | undefined) {
    if (v) this._variant = v;
  }
  get variant(): BtnVariant { return this._variant; }

  /** Paleta (accent/neutral/danger) */
  @Input() tone: BtnTone = 'accent';
  /** Tamanho */
  @Input() size: BtnSize = 'md';
  /** Largura total */

  /** Flags booleanas com coerção de atributo */
  @Input({ transform: booleanAttribute }) block = false;
  @Input({ transform: booleanAttribute }) iconOnly = false;
  @Input({ transform: booleanAttribute }) busy = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  private get isButton() {
    return this.el.nativeElement.tagName.toLowerCase() === 'button';
  }

  // ===== A11y / estados =====
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

  @HostBinding('class.btn--solid')   get cSolid()   { return this.variant === 'solid'; }
  @HostBinding('class.btn--ghost')   get cGhost()   { return this.variant === 'ghost'; }
  @HostBinding('class.btn--outline') get cOutline() { return this.variant === 'outline'; }
  @HostBinding('class.btn--pill')    get cPill()    { return this.variant === 'pill'; }
  @HostBinding('class.btn--link')    get cLink()    { return this.variant === 'link'; }

  @HostBinding('class.btn--accent')  get tAccent()  { return this.tone === 'accent'; }
  @HostBinding('class.btn--neutral') get tNeutral() { return this.tone === 'neutral'; }
  @HostBinding('class.btn--danger')  get tDanger()  { return this.tone === 'danger'; }

  @HostBinding('class.btn--xs')      get sXs()      { return this.size === 'xs'; }
  @HostBinding('class.btn--sm')      get sSm()      { return this.size === 'sm'; }
  @HostBinding('class.btn--md')      get sMd()      { return this.size === 'md'; }
  @HostBinding('class.btn--lg')      get sLg()      { return this.size === 'lg'; }

  @HostBinding('class.btn--block')   get cBlock()   { return this.block; }
  @HostBinding('class.btn--icononly') get cIcon()   { return this.iconOnly; }
  @HostBinding('class.is-busy')      get cBusy()    { return this.busy; }
}
