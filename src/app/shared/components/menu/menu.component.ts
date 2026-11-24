import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  Injector,
  OnDestroy,
  ViewEncapsulation,
  afterNextRender,
  contentChildren,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { MenuItemDirective } from './menu.directives';
import { MenuPlacement, placeMenu } from './menu-position';

let uid = 0;

/** o botão que abre o menu (registrado pelo `appMenuTrigger`) */
export interface MenuTriggerRef { el: HTMLElement; id: string; }

/** onde o foco vai ao abrir */
export type MenuFocus = 'first' | 'last';

/**
 * Menu de ações (padrão WAI-ARIA "menu button"). O botão usa `[appMenuTrigger]`, e os
 * itens são `<button appMenuItem>` / `<a appMenuItem>` nativos:
 *
 * ```html
 * <button appButton [appMenuTrigger]="acoes">Ações</button>
 * <app-menu #acoes label="Ações do pedido">
 *   <button appMenuItem (click)="editar()">Editar</button>
 *   <hr appMenuSeparator>
 *   <button appMenuItem tone="danger" (click)="excluir()">Excluir</button>
 * </app-menu>
 * ```
 *
 * Abre com `position: fixed` junto ao botão (vira para cima sem espaço, não é cortado
 * por `overflow`), fecha com Esc, Tab, clique fora ou ao escolher um item.
 */
@Component({
  selector: 'app-menu',
  standalone: true,
  exportAs: 'appMenu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // os itens são projetados (vêm do template de quem usa): estilos sem encapsulamento, sob .menu
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnDestroy {
  /** nome do menu para leitor de tela; sem ele, o menu é nomeado pelo texto do botão */
  readonly label = input<string | null>(null);
  /** lado e alinhamento preferidos (vira sozinho quando não cabe) */
  readonly placement = input<MenuPlacement>('bottom-start');
  /** abriu (`true`) ou fechou (`false`) */
  readonly openedChange = output<boolean>();

  readonly id = `menu-${++uid}`;
  readonly isOpen = signal(false);
  readonly top = signal(0);
  readonly left = signal(0);
  readonly maxHeight = signal<number | null>(null);
  readonly actualPlacement = signal<MenuPlacement>('bottom-start');
  trigger: MenuTriggerRef | null = null;

  private readonly items = contentChildren(MenuItemDirective, { descendants: true });
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private typed = '';
  private typedTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // fase de captura: roda antes do (click) do item (veja onItemClickCapture)
    afterNextRender(() => {
      this.panel().nativeElement.addEventListener('click', e => this.onItemClickCapture(e), { capture: true });
    });
  }

  private readonly onViewportChange = () => this.position();
  /** clique em andamento no botão: o foco vai para ele, mas quem fecha é o clique (toggle) */
  private pointerOnTrigger = false;

  private readonly onDocPointerDown = (e: PointerEvent) => {
    const path = e.composedPath();
    if (this.trigger && path.includes(this.trigger.el)) {
      this.pointerOnTrigger = true;
      setTimeout(() => (this.pointerOnTrigger = false));
      return;
    }
    if (path.includes(this.panel().nativeElement)) return;
    this.close(false);
  };

  open(trigger: MenuTriggerRef, focus: MenuFocus = 'first') {
    this.trigger = trigger;
    if (this.isOpen()) { this.focusItem(focus); return; }
    this.isOpen.set(true);
    this.openedChange.emit(true);
    const win = this.doc.defaultView;
    win?.addEventListener('resize', this.onViewportChange);
    win?.addEventListener('scroll', this.onViewportChange, true);
    this.doc.addEventListener('pointerdown', this.onDocPointerDown, true);
    // depois que o painel aparecer: mede, posiciona e foca
    afterNextRender(() => {
      this.position();
      this.focusItem(focus);
    }, { injector: this.injector });
  }

  /** @param returnFocus devolve o foco ao botão (Esc, escolher um item) */
  close(returnFocus = true) {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.openedChange.emit(false);
    this.removeListeners();
    if (returnFocus) this.trigger?.el.focus();
  }

  toggle(trigger: MenuTriggerRef, focus: MenuFocus = 'first') {
    if (this.isOpen()) this.close(); else this.open(trigger, focus);
  }

  ngOnDestroy() {
    this.removeListeners();
    clearTimeout(this.typedTimer);
  }

  // ===== teclado (padrão de menu)
  onKeydown(e: KeyboardEvent) {
    const list = this.items().map(i => i.el);
    const current = list.indexOf(this.doc.activeElement as HTMLButtonElement);
    const go = (i: number) => { e.preventDefault(); list[(i + list.length) % list.length]?.focus(); };

    switch (e.key) {
      case 'ArrowDown': return go(current + 1);
      case 'ArrowUp': return go(current < 0 ? -1 : current - 1);
      case 'Home': return go(0);
      case 'End': return go(-1);
      case 'Escape':
        // tratado aqui: um Dialog por trás não fecha junto
        e.preventDefault();
        e.stopPropagation();
        return this.close();
      case 'Tab':
        // Tab e Shift+Tab: fecha e deixa o navegador levar o foco ao próximo/anterior
        // (no Shift+Tab, quase sempre o próprio botão)
        return this.close(false);
      case ' ':
        // link não age com Espaço (só com Enter): no menu, os dois escolhem
        if (this.doc.activeElement instanceof HTMLAnchorElement) {
          e.preventDefault();
          (this.doc.activeElement as HTMLElement).click();
        }
        return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) this.typeahead(e.key, current);
  }

  /**
   * O foco saiu do menu (Tab, clique em outro lugar): fecha, sem puxar o foco de volta.
   * Voltar ao botão também fecha, a não ser num clique nele: aí o clique fecha (toggle),
   * e fechar aqui faria o clique reabrir.
   */
  onFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (!next || this.panel().nativeElement.contains(next)) return;
    if (this.trigger?.el.contains(next) && this.pointerOnTrigger) return;
    this.close(false);
  }

  /**
   * Escolher um item fecha o menu e devolve o foco ao botão **antes** da ação do item
   * (fase de captura): se ela abrir um Dialog, ele guarda o botão para devolver o foco.
   */
  onItemClickCapture(e: MouseEvent) {
    const item = (e.target as Element).closest('[role="menuitem"]');
    if (!item || item.getAttribute('aria-disabled') === 'true') return;
    this.close();
  }

  private focusItem(where: MenuFocus) {
    const list = this.items().map(i => i.el);
    (where === 'first' ? list[0] : list[list.length - 1])?.focus();
  }

  /** digitar leva ao próximo item que começa com o texto (sem acento nem caixa) */
  private typeahead(key: string, current: number) {
    clearTimeout(this.typedTimer);
    this.typed += key;
    this.typedTimer = setTimeout(() => (this.typed = ''), 500);
    const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const items = this.items();
    const q = norm(this.typed);
    // a mesma letra repetida passa pelos itens com essa inicial
    const query = q.split('').every(c => c === q[0]) ? q[0] : q;
    for (let step = 1; step <= items.length; step++) {
      const i = (current + step) % items.length;
      if (norm(items[i].text).startsWith(query)) { items[i].el.focus(); return; }
    }
  }

  private position() {
    const trigger = this.trigger?.el;
    const win = this.doc.defaultView;
    if (!trigger || !win || !this.isOpen()) return;
    const panel = this.panel().nativeElement;
    panel.style.maxHeight = ''; // mede o tamanho natural
    const a = trigger.getBoundingClientRect();
    const p = placeMenu(
      this.placement(),
      { top: a.top, left: a.left, width: a.width, height: a.height },
      { width: panel.offsetWidth, height: panel.scrollHeight },
      { width: win.innerWidth, height: win.innerHeight },
    );
    this.top.set(p.top);
    this.left.set(p.left);
    this.maxHeight.set(p.maxHeight);
    this.actualPlacement.set(p.placement);
  }

  private removeListeners() {
    const win = this.doc.defaultView;
    win?.removeEventListener('resize', this.onViewportChange);
    win?.removeEventListener('scroll', this.onViewportChange, true);
    this.doc.removeEventListener('pointerdown', this.onDocPointerDown, true);
  }
}
