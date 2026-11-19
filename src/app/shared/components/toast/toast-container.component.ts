import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ToastService } from '../../services/toast.service';

import { ButtonDirective } from '../button/button.directive';

import { Toast } from '../../model/interface/toast.interface';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.sass',
  standalone: true,
  imports: [
    ButtonDirective
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // um Dialog aberto deixa o resto da página inerte; os toasts continuam ativos
  host: { 'data-dialog-keep-active': '' }
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}

  onAction(t: Toast) {
    t.onAction?.();
    this.toast.dismiss(t.id);
  }
}
