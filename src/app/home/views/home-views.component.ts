import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { TPipe } from '../../site/i18n/t.pipe';
import { TABS_IMPORTS } from '../../shared/components/tabs';

/** "Para quem vai usar" / "Como foi feito", nas Tabs da própria biblioteca */
@Component({
  selector: 'app-home-views',
  imports: [TPipe, ...TABS_IMPORTS],
  templateUrl: './home-views.component.html',
  styleUrl: './home-views.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeViewsComponent {
  readonly view = signal<string | null>('dev');

  /** os três passos de quem vai usar (título, texto e o trecho de código) */
  readonly steps = [
    { key: 'copy', code: 'src/app/shared/components/table/\nimports: [TableComponent]' },
    { key: 'theme', code: ':root {\n  --accent: #058075;\n}' },
    { key: 'lang', code: 'provideUiLabels(UI_LABELS_PT)' },
  ];

  readonly about = ['a11y', 'ng', 'quality'];
}
