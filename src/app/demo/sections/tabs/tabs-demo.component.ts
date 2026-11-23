import { Component, ChangeDetectionStrategy, computed, inject, input, signal } from '@angular/core';

import { TPipe } from '../../../site/i18n/t.pipe';
import { I18nService } from '../../../site/services/i18n.service';
import { TABS_IMPORTS } from '../../../shared/components/tabs';
import { SwitchComponent } from '../../../shared/components/switch/switch.component';

/** conteúdo "pesado" de exemplo: mostra quando foi criado */
@Component({
  selector: 'app-tab-stamp',
  standalone: true,
  imports: [TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<code>{{ 'tabs.stamp' | t:{ name: name(), time: time } }}</code>`,
})
export class TabStampComponent {
  readonly name = input('');
  readonly time = new Date().toLocaleTimeString('pt-BR');
}

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [TPipe, ...TABS_IMPORTS, SwitchComponent, TabStampComponent],
  templateUrl: './tabs-demo.component.html',
  styleUrl: './tabs-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TabsDemoComponent {
  private i18n = inject(I18nService);

  account = signal<string | null>('overview');
  notify = signal(true);

  keepAlive = signal(false);

  /** nomes dos meses no idioma da demo; abre no mês atual (a lista rola até ele) */
  months = computed(() => {
    const fmt = new Intl.DateTimeFormat(this.i18n.lang() === 'en' ? 'en' : 'pt-BR', { month: 'long' });
    return Array.from({ length: 12 }, (_, i) => {
      const name = fmt.format(new Date(2026, i, 1));
      return { key: String(i + 1), label: name.charAt(0).toUpperCase() + name.slice(1) };
    });
  });
  month = signal<string | null>(String(new Date().getMonth() + 1));
}
