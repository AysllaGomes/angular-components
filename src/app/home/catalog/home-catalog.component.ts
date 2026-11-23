import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TPipe } from '../../shared/i18n/t.pipe';

/** os componentes, cada um levando à seção dele na demo (/demo#id) */
@Component({
  selector: 'app-home-catalog',
  imports: [RouterLink, TPipe],
  templateUrl: './home-catalog.component.html',
  styleUrl: './home-catalog.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeCatalogComponent {
  /** ids = ids das <section> da demo (e das chaves nav.<id> / home.catalog.<id>) */
  readonly items = [
    'table', 'select', 'treeselect', 'tabs', 'dialog', 'actionbar', 'tooltip', 'toast',
    'stepper', 'pagination', 'checkbox', 'radio', 'switch', 'button', 'validation',
  ];
}
