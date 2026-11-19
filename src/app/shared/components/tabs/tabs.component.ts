import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TABS_HOST, TabsHost } from './tabs.token';
import { TabComponent } from './tab.component';

let uid = 0;

export type TabsActivation = 'auto' | 'manual';

/**
 * Abas no padrão WAI-ARIA (tablist / tab / tabpanel).
 *
 * ```html
 * <app-tabs ariaLabel="Conta" [(selected)]="aba">
 *   <app-tab key="perfil" label="Perfil">…</app-tab>
 *   <app-tab key="pedidos" label="Pedidos" [badge]="3">…</app-tab>
 * </app-tabs>
 * ```
 *
 * Teclado: Tab entra na aba atual e sai para o painel; ← → trocam de aba
 * (pulando as desabilitadas, com volta), Home/End vão para a primeira/última.
 * `activation="manual"`: as setas só movem o foco e Enter/Espaço abrem a aba.
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TABS_HOST, useExisting: forwardRef(() => TabsComponent) }]
})
export class TabsComponent implements TabsHost {
  /** chave da aba aberta (two-way `[(selected)]`); vazia/inválida → primeira habilitada */
  readonly selected = model<string | null>(null);
  readonly activation = input<TabsActivation>('auto');
  /** mantém o conteúdo `appTabContent` depois da primeira visita (em vez de destruir) */
  readonly keepAlive = input(false, { transform: booleanAttribute });
  /** nome da lista de abas para leitor de tela (ex.: "Seções da conta") */
  readonly ariaLabel = input<string | null>(null);

  readonly tabs = contentChildren(TabComponent);
  readonly uid = `tabs-${++uid}`;

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  readonly activeKey = computed(() => {
    const tabs = this.tabs();
    const sel = this.selected();
    const hit = tabs.find(t => t.id() === sel && !t.disabled());
    return (hit ?? tabs.find(t => !t.disabled()))?.id() ?? null;
  });

  /** aba com o foco no modo manual (pode ser diferente da aberta) */
  private readonly focusKey = signal<string | null>(null);

  /** a única aba alcançável com Tab (roving tabindex) */
  readonly tabStop = computed(() => {
    const f = this.focusKey();
    return f !== null && this.tabs().some(t => t.id() === f && !t.disabled()) ? f : this.activeKey();
  });

  constructor() {
    // a aba aberta fica sempre visível quando a lista rola na horizontal;
    // de novo se a lista ou a aba mudarem de tamanho (fonte carregando, girar o celular)
    afterRenderEffect(onCleanup => {
      const key = this.activeKey();
      const tab = this.tabs().find(t => t.id() === key);
      if (!tab) return;
      this.reveal(tab);
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => this.reveal(tab));
      ro.observe(this.list().nativeElement);
      const btn = this.button(tab);
      if (btn) ro.observe(btn);
      onCleanup(() => ro.disconnect());
    });
  }

  select(tab: TabComponent) {
    if (tab.disabled()) return;
    this.selected.set(tab.id());
  }

  onFocus(tab: TabComponent) { this.focusKey.set(tab.id()); }

  /** saindo da lista, o Tab volta a cair na aba aberta */
  onFocusOut(ev: FocusEvent) {
    if (!this.list().nativeElement.contains(ev.relatedTarget as Node | null)) this.focusKey.set(null);
  }

  onKeydown(ev: KeyboardEvent, tab: TabComponent) {
    const enabled = this.tabs().filter(t => !t.disabled());
    const n = enabled.length;
    const i = enabled.indexOf(tab);
    if (!n || i < 0) return;

    let next: TabComponent;
    switch (ev.key) {
      case 'ArrowRight': next = enabled[(i + 1) % n]; break;
      case 'ArrowLeft':  next = enabled[(i - 1 + n) % n]; break;
      case 'Home':       next = enabled[0]; break;
      case 'End':        next = enabled[n - 1]; break;
      default: return;
    }
    ev.preventDefault();

    this.focusKey.set(next.id());
    this.button(next)?.focus();
    if (this.activation() === 'auto') this.select(next);
    else this.reveal(next);
  }

  private button(tab: TabComponent) {
    return this.list().nativeElement.querySelector<HTMLElement>(`#${tab.tabId()}`);
  }

  /** rola só a lista (nunca a página) até a aba aparecer inteira */
  private reveal(tab: TabComponent) {
    const list = this.list().nativeElement;
    const btn = this.button(tab);
    if (!btn || list.scrollWidth <= list.clientWidth) return;
    const pad = 24; // deixa ver um pedaço da vizinha: indica que há mais abas
    const left = btn.offsetLeft - pad;
    const right = btn.offsetLeft + btn.offsetWidth + pad;
    if (left < list.scrollLeft) list.scrollLeft = Math.max(0, left);
    else if (right > list.scrollLeft + list.clientWidth) list.scrollLeft = right - list.clientWidth;
  }
}
