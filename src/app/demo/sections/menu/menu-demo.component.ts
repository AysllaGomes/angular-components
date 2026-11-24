import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { TPipe } from '../../../site/i18n/t.pipe';
import { I18nService } from '../../../site/services/i18n.service';
import { MENU_IMPORTS } from '../../../shared/components/menu';
import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [TPipe, ...MENU_IMPORTS, ButtonDirective, DialogComponent],
  templateUrl: './menu-demo.component.html',
  styleUrl: './menu-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDemoComponent {
  private readonly i18n = inject(I18nService);
  private readonly toast = inject(ToastService);

  readonly orders = [1042, 1043, 1044, 1045, 1046, 1047];
  readonly chosen = signal('');
  readonly confirmOpen = signal(false);

  choose(key: string, n?: number) {
    const action = this.i18n.t(key) + (n ? ` #${n}` : '');
    this.chosen.set(this.i18n.t('menu.demo.done', { action }));
  }

  delete() {
    this.confirmOpen.set(false);
    this.toast.success(this.i18n.t('menu.demo.deleted'));
  }
}
