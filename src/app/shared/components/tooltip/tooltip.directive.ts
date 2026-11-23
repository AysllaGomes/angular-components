import { isPlatformBrowser } from '@angular/common';
import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute
} from '@angular/core';

import { TooltipPosition, placeTooltip } from './tooltip-position';

let uid = 0;

/** só um balão aberto por vez na página */
let openTooltip: TooltipDirective | null = null;

/**
 * Dica curta sobre um elemento, mostrada ao passar o mouse ou focar pelo teclado.
 *
 * ```html
 * <button appButton="ghost" iconOnly appTooltip="Editar" tooltipAsLabel>✎</button>
 * <button type="button" aria-label="Sobre o CPF" appTooltip="Só os números, com ou sem pontos">ⓘ</button>
 * ```
 *
 * - O balão vai para o `<body>` com `position: fixed`: não é cortado por
 *   `overflow: hidden` nem fica atrás de outros elementos; vira para o lado
 *   oposto quando não cabe e nunca sai da janela.
 * - Leitor de tela: o texto é a **descrição** do elemento (`aria-describedby`),
 *   ou o **nome** dele com `tooltipAsLabel` (`aria-labelledby`), para botões só
 *   com ícone. O elemento do balão existe desde o início (escondido), então a
 *   dica é lida ao focar, sem esperar o balão aparecer.
 * - WCAG 1.4.13: **Esc** fecha sem mover o foco; dá para levar o mouse até o
 *   balão (para ler ou ampliar) sem ele sumir; ele fica aberto enquanto houver
 *   mouse ou foco.
 * - Foco por clique não abre o balão (só foco de teclado, `:focus-visible`);
 *   toque também não, porque não existe "passar o mouse" no celular. Por isso a
 *   dica nunca deve ser a única forma de saber algo essencial.
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'onPointerLeave($event)',
    '(pointerdown)': 'onPointerDown($event)',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut($event)',
  }
})
export class TooltipDirective {
  /** texto da dica; vazio ou `null` desliga a dica */
  readonly text = input<string | null | undefined>(null, { alias: 'appTooltip' });
  /** lado preferido; vira para o oposto se não couber */
  readonly position = input<TooltipPosition>('top', { alias: 'tooltipPosition' });
  readonly disabled = input(false, { alias: 'tooltipDisabled', transform: booleanAttribute });
  /** a dica é o nome do elemento (botão só com ícone), não uma descrição extra */
  readonly asLabel = input(false, { alias: 'tooltipAsLabel', transform: booleanAttribute });
  /** espera (ms) antes de abrir no mouse; o foco pelo teclado abre na hora */
  readonly showDelay = input(300, { alias: 'tooltipShowDelay', transform: numberAttribute });
  /** espera (ms) antes de fechar, para dar tempo de levar o mouse até o balão */
  readonly hideDelay = input(100, { alias: 'tooltipHideDelay', transform: numberAttribute });

  readonly id = `tip-${++uid}`;

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly doc = inject(DOCUMENT);
  private readonly tip: HTMLElement | null = null;

  private readonly active = computed(() => !!this.text()?.trim() && !this.disabled());

  private opened = false;
  private hovered = false;
  private focused = false;
  /** fechado com Esc ou clique: só volta depois que o mouse e o foco saírem */
  private dismissed = false;
  private showTimer: ReturnType<typeof setTimeout> | undefined;
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  /** atributo ARIA que aponta para o balão agora (ou nenhum) */
  private linkedAttr: string | null = null;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const tip = this.doc.createElement('div');
    tip.id = this.id;
    tip.className = 'app-tooltip';
    tip.setAttribute('role', 'tooltip');
    // Dialog/ActionBar deixam o resto da página inerte; o balão de um campo dentro
    // deles precisa continuar recebendo o mouse
    tip.setAttribute('data-dialog-keep-active', '');
    tip.hidden = true;
    tip.addEventListener('pointerenter', () => { this.hovered = true; this.cancelHide(); });
    tip.addEventListener('pointerleave', () => { this.hovered = false; this.afterLeave(); });
    this.doc.body.appendChild(tip);
    this.tip = tip;

    effect(() => {
      const text = this.text()?.trim() ?? '';
      tip.textContent = text;
      this.link(this.active() ? (this.asLabel() ? 'aria-labelledby' : 'aria-describedby') : null);
      if (!this.active()) this.hide();
      else if (this.opened) this.reposition(this.position());
    });

    inject(DestroyRef).onDestroy(() => {
      this.hide();
      this.link(null);
      tip.remove();
    });
  }

  /** o balão está aberto? */
  get isOpen() { return this.opened; }

  // ---- eventos do elemento

  onPointerEnter(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    this.hovered = true;
    this.cancelHide();
    // passando de um botão com dica para outro (ex.: barra de ferramentas): sem espera
    this.scheduleShow(openTooltip && openTooltip !== this ? 0 : this.showDelay());
  }

  onPointerLeave(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    this.hovered = false;
    this.afterLeave();
  }

  /** clicar no elemento fecha a dica (ela não cobre o menu/diálogo que o clique abre) */
  onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    this.dismissed = true;
    this.hide();
  }

  onFocusIn(e: FocusEvent) {
    // foco por clique não segura a dica aberta (senão ela ficaria até o próximo Tab)
    if (!isFocusVisible(e.target as Element)) return;
    this.focused = true;
    this.cancelHide();
    this.scheduleShow(0);
  }

  onFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    this.focused = false;
    this.afterLeave();
  }

  // ---- abrir/fechar

  show() {
    const tip = this.tip;
    if (!tip || !this.active() || this.opened) return;
    if (openTooltip && openTooltip !== this) openTooltip.hide();
    openTooltip = this;

    this.opened = true;
    tip.hidden = false;
    this.reposition(this.position());

    this.doc.addEventListener('keydown', this.onKeydown, true);
    const win = this.doc.defaultView;
    win?.addEventListener('scroll', this.onViewportChange, { capture: true, passive: true });
    win?.addEventListener('resize', this.onViewportChange, { passive: true });
  }

  hide() {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    if (!this.opened) return;
    this.opened = false;
    if (this.tip) this.tip.hidden = true;
    if (openTooltip === this) openTooltip = null;

    this.doc.removeEventListener('keydown', this.onKeydown, true);
    const win = this.doc.defaultView;
    win?.removeEventListener('scroll', this.onViewportChange, true);
    win?.removeEventListener('resize', this.onViewportChange);
  }

  private scheduleShow(delay: number) {
    if (!this.active() || this.dismissed || this.opened) return;
    clearTimeout(this.showTimer);
    if (delay <= 0) this.show();
    else this.showTimer = setTimeout(() => this.show(), delay);
  }

  private cancelHide() { clearTimeout(this.hideTimer); }

  /** mouse ou foco saiu: fecha (com uma pequena espera) se nenhum dos dois ficou */
  private afterLeave() {
    if (this.hovered || this.focused) return;
    this.dismissed = false;
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    if (!this.opened) return;
    const delay = this.hideDelay();
    if (delay <= 0) this.hide();
    else this.hideTimer = setTimeout(() => this.hide(), delay);
  }

  /**
   * Esc fecha só a dica: o evento para aqui, então um Dialog aberto por trás não
   * fecha junto (o próximo Esc fecha o Dialog).
   */
  private readonly onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !this.opened) return;
    e.stopPropagation();
    this.dismissed = true;
    this.hide();
  };

  private readonly onViewportChange = () => {
    if (this.opened) this.reposition(this.position());
  };

  private reposition(preferred: TooltipPosition) {
    const tip = this.tip!;
    const win = this.doc.defaultView;
    // mede no canto, sem a posição anterior limitar a largura
    tip.style.top = '0px';
    tip.style.left = '0px';
    const place = placeTooltip(
      preferred,
      this.host.getBoundingClientRect(),
      { width: tip.offsetWidth, height: tip.offsetHeight },
      { width: this.doc.documentElement.clientWidth || win?.innerWidth || 0, height: win?.innerHeight ?? 0 },
    );
    tip.dataset['position'] = place.position;
    tip.style.top = `${Math.round(place.top)}px`;
    tip.style.left = `${Math.round(place.left)}px`;
    tip.style.setProperty('--tip-arrow', `${Math.round(place.arrow)}px`);
  }

  /** acrescenta/remove o id do balão no `aria-describedby`/`aria-labelledby`, sem apagar ids que já estavam lá */
  private link(attr: string | null) {
    if (attr === this.linkedAttr) return;
    if (this.linkedAttr) this.setIdToken(this.linkedAttr, false);
    this.linkedAttr = attr;
    if (attr) this.setIdToken(attr, true);
  }

  private setIdToken(attr: string, present: boolean) {
    const ids = (this.host.getAttribute(attr) ?? '').split(/\s+/).filter(t => t && t !== this.id);
    if (present) ids.push(this.id);
    if (ids.length) this.host.setAttribute(attr, ids.join(' '));
    else this.host.removeAttribute(attr);
  }
}

/** foco de teclado? (navegadores/ambientes sem `:focus-visible` contam como sim) */
function isFocusVisible(el: Element | null): boolean {
  if (!el) return false;
  try { return el.matches(':focus-visible'); } catch { return true; }
}
