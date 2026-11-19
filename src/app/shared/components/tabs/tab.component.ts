import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TABS_HOST } from './tabs.token';
import { TabContentDirective, TabLabelDirective } from './tab-templates.directive';

/**
 * Uma aba do `app-tabs`. O próprio elemento é o painel (`role="tabpanel"`).
 *
 * - Conteúdo direto: criado junto com a página e só escondido (mantém estado).
 * - `<ng-template appTabContent>`: criado só quando a aba é aberta.
 */
@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (rendered()) {
      @if (lazyTpl(); as tpl) { <ng-container [ngTemplateOutlet]="tpl" /> }
    }
    <ng-content />
  `,
  styleUrl: './tab.component.sass',
  host: {
    role: 'tabpanel',
    tabindex: '0',
    '[id]': 'panelId()',
    '[attr.aria-labelledby]': 'tabId()',
    '[hidden]': '!active()',
  }
})
export class TabComponent {
  /** identificador da aba em `[(selected)]`; sem ele, vale a posição ("0", "1"...) */
  readonly key = input<string | null>(null);
  readonly label = input('');
  /** contador ao lado do rótulo (ex.: pendências) */
  readonly badge = input<string | number | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly labelTpl = contentChild(TabLabelDirective, { read: TemplateRef, descendants: false });
  readonly lazyTpl = contentChild(TabContentDirective, { read: TemplateRef, descendants: false });

  private readonly host = inject(TABS_HOST);

  readonly index = computed(() => this.host.tabs().indexOf(this));
  readonly id = computed(() => this.key() ?? String(this.index()));
  readonly tabId = computed(() => `${this.host.uid}-tab-${this.index()}`);
  readonly panelId = computed(() => `${this.host.uid}-panel-${this.index()}`);
  readonly active = computed(() => this.host.activeKey() === this.id());

  /** já foi aberta alguma vez (para o `keepAlive`) */
  private readonly visited = linkedSignal<boolean, boolean>({
    source: this.active,
    computation: (active, prev) => active || (prev?.value ?? false),
  });

  readonly rendered = computed(() => {
    const visited = this.visited(); // sempre lido: o linkedSignal só acompanha o `active` quando é lido
    return this.active() || (this.host.keepAlive() && visited);
  });
}
