import { ChangeDetectionStrategy, Component , computed } from '@angular/core';

import { injectUiLabels } from '../../labels';

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
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  constructor(public toast: ToastService) {}

  onAction(t: Toast) {
    t.onAction?.();
    this.toast.dismiss(t.id);
  }
}
