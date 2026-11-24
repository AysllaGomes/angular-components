import { DestroyRef, Directive, ElementRef, booleanAttribute, inject, input } from '@angular/core';

export type MenuItemTone = 'default' | 'danger';

/**
 * Item do menu: um `<button>` ou `<a>` nativo (com `routerLink`, `href`, ícone...).
 * Ganha `role="menuitem"` e sai da ordem do Tab (o menu move o foco pelas setas).
 *
 * Desabilitado (`disabled`) continua focável, como pede o padrão de menu, mas não age:
 * `aria-disabled` e o clique barrado antes de qualquer outro tratador (o seu `(click)`,
 * o `routerLink`).
 */
@Directive({
  selector: 'button[appMenuItem], a[appMenuItem]',
  standalone: true,
  host: {
    role: 'menuitem',
    tabindex: '-1',
    class: 'menu__item',
    '[class.menu__item--danger]': 'tone() === "danger"',
    '[attr.aria-disabled]': 'disabled() || null',
    // `<button appMenuItem disabled>` também poria o disabled nativo, que tira o foco do
    // item; no menu, desabilitado continua focável (padrão WAI-ARIA), só não age
    '[attr.disabled]': 'null',
  },
})
export class MenuItemDirective {
  readonly disabled = input(false, { transform: booleanAttribute });
  /** `danger` para ações destrutivas (ex.: Excluir) */
  readonly tone = input<MenuItemTone>('default');

  readonly el = inject<ElementRef<HTMLButtonElement | HTMLAnchorElement>>(ElementRef).nativeElement;

  constructor() {
    // um <button> dentro de <form> enviaria o formulário
    if (this.el instanceof HTMLButtonElement && !this.el.hasAttribute('type')) this.el.type = 'button';

    const block = (e: Event) => {
      if (!this.disabled()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    this.el.addEventListener('click', block, { capture: true });
    inject(DestroyRef).onDestroy(() => this.el.removeEventListener('click', block, { capture: true }));
  }

  /** texto usado na busca por inicial */
  get text() { return this.el.textContent?.trim() ?? ''; }
}

/** Linha que separa grupos de itens (`<hr appMenuSeparator>`). */
@Directive({
  selector: '[appMenuSeparator]',
  standalone: true,
  host: { role: 'separator', class: 'menu__sep' },
})
export class MenuSeparatorDirective {}
