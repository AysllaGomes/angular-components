import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';

import { TPipe } from '../../../site/i18n/t.pipe';

import { ActionBarComponent } from '../../../shared/components/actionbar/actionbar.component';
import {ButtonDirective} from '../../../shared/components/button/button.directive';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { I18nService } from '../../../site/services/i18n.service';

@Component({
  selector: 'app-actionbar-demo',
  standalone: true,
  imports: [ActionBarComponent, DialogComponent, TPipe, ButtonDirective],
  templateUrl: './actionbar-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './actionbar-demo.component.sass'
})
export class ActionBarDemoComponent {
  openSm   = signal(false);
  openMd   = signal(false);
  openLg   = signal(false);
  openAuto = signal(false);

  /** pedido aberto no painel e a confirmação por cima dele */
  openOrder = signal(false);
  confirmDelete = signal(false);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  deleteOrder() {
    this.confirmDelete.set(false);
    this.openOrder.set(false);
    this.toast.success(this.i18n.t('actionbar.demo.order.deleted'));
  }
}
