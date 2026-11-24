import { Directive, ElementRef, inject, input } from '@angular/core';

import { MenuComponent, MenuTriggerRef } from './menu.component';

let uid = 0;

/**
 * Botão que abre um `app-menu`: `<button appButton [appMenuTrigger]="acoes">Ações</button>`.
 *
 * Ganha `aria-haspopup="menu"`, `aria-expanded` e `aria-controls`. Clique, Enter, Espaço
 * e ↓ abrem no primeiro item; ↑ abre no último.
 */
@Directive({
  selector: '[appMenuTrigger]',
  standalone: true,
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'menu().isOpen()',
    '[attr.aria-controls]': 'menu().isOpen() ? menu().id : null',
    '(click)': 'menu().toggle(ref)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class MenuTriggerDirective {
  /** o menu que este botão abre (`#acoes` no `<app-menu>`) */
  readonly menu = input.required<MenuComponent>({ alias: 'appMenuTrigger' });

  readonly ref: MenuTriggerRef;

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    // o menu sem `label` é nomeado pelo texto do botão (aria-labelledby)
    if (!el.id) el.id = `menu-trigger-${++uid}`;
    this.ref = { el, id: el.id };
  }

  onKeydown(e: KeyboardEvent) {
    // Enter/Espaço no <button> já viram clique (toggle); aqui só as setas
    if (e.key === 'ArrowDown') { e.preventDefault(); this.menu().open(this.ref, 'first'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.menu().open(this.ref, 'last'); }
  }
}
