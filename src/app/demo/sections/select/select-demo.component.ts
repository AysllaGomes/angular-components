import { Component, computed, inject, signal } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { I18nService } from '../../../shared/services/i18n.service';

import { SelectComponent } from '../../../shared/components/select/select.component';

import { SelectOption } from '../../../shared/model/interface/select/select-option.interface';

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [SelectComponent, TPipe],
  templateUrl: './select-demo.component.html',
  styleUrl: './select-demo.component.sass'
})
export class SelectDemoComponent {
  private i18n = inject(I18nService);

  categoriaBasic   = signal<string | null>(null);
  categoriaFilter  = signal<string | null>(null);
  categoriaDisabled= signal<string | null>('o1');
  categoriaNoReq   = signal<string | null>(null);

  options = computed<SelectOption<string>[]>(() => [
    { label: this.i18n.t('select.option.hover'), value: 'hover' },
    { label: this.i18n.t('select.option.o1'),    value: 'o1' },
    { label: this.i18n.t('select.option.o2'),    value: 'o2' },
  ]);
}
