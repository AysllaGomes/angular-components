import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { injectIsEn } from './lang';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ActionBarComponent } from '../../shared/components/actionbar/actionbar.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { ToastContainerComponent } from '../../shared/components/toast/toast-container.component';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ButtonDirective } from '../../shared/components/button/button.directive';

/*
 * Exemplos ao vivo do grupo Sobreposições. Cada um reproduz o exemplo de "Uso" do .md
 * (o que a aba "Código" mostra), no idioma da página. Os que abrem por cima da página
 * ganham o botão que os abre.
 */

const STATUS = `
:host
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: .75rem
.status
  flex-basis: 100%
  margin: 0
  min-height: 1.5em
  color: var(--muted, #5f6a75)
  font-size: .9375rem
`;

/** dialog.md → ## Uso */
@Component({
  selector: 'app-dialog-example',
  imports: [DialogComponent, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <button appButton type="button" (click)="open.set(true)">{{ en ? 'Delete order' : 'Excluir pedido' }}</button>

    <app-dialog
      [title]="en ? 'Delete order?' : 'Excluir pedido?'"
      [(opened)]="open"
      describedBy="cp-delete-desc"
      [primaryLabel]="en ? 'Delete' : 'Excluir'"
      [secondaryLabel]="en ? 'Cancel' : 'Cancelar'"
      (primary)="delete()">
      <p id="cp-delete-desc">{{ en ? 'This action cannot be undone.' : 'Esta ação não pode ser desfeita.' }}</p>
    </app-dialog>
    <p class="status" role="status">{{ deleted() ? (en ? 'Order deleted.' : 'Pedido excluído.') : '' }}</p>
  `,
  styles: STATUS
})
export class DialogExampleComponent {
  readonly isEn = injectIsEn();
  readonly open = signal(false);
  readonly deleted = signal(false);

  delete() {
    this.deleted.set(true);
    this.open.set(false);
  }
}

/** actionbar.md → ## Uso */
@Component({
  selector: 'app-actionbar-example',
  imports: [ActionBarComponent, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <button appButton type="button" (click)="open.set(true)">{{ en ? 'Open the action bar' : 'Abrir o actionbar' }}</button>

    <app-actionbar
      [title]="en ? 'Action bar title' : 'Título do actionbar'"
      size="md"
      [(opened)]="open"
      [primaryLabel]="en ? 'Confirm' : 'Confirmar'"
      [secondaryLabel]="en ? 'Cancel' : 'Cancelar'"
      (primary)="onConfirm()"
      (secondary)="open.set(false)">
      <p>{{ en ? 'Your content goes here: a form, details, filters…' : 'Seu conteúdo vai aqui: um formulário, detalhes, filtros…' }}</p>
    </app-actionbar>
    <p class="status" role="status">{{ confirmed() ? (en ? 'Confirmed.' : 'Confirmado.') : '' }}</p>
  `,
  styles: STATUS
})
export class ActionBarExampleComponent {
  readonly isEn = injectIsEn();
  readonly open = signal(false);
  readonly confirmed = signal(false);

  onConfirm() {
    this.confirmed.set(true);
    this.open.set(false);
  }
}

/** tooltip.md → ## Uso */
@Component({
  selector: 'app-tooltip-example',
  imports: [TooltipDirective, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button appButton="ghost" iconOnly type="button" [appTooltip]="isEn() ? 'Edit' : 'Editar'" tooltipAsLabel>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </button>
  `
})
export class TooltipExampleComponent {
  readonly isEn = injectIsEn();
}

/** toast.md → ## Uso (o container, e os botões do exemplo em TypeScript) */
@Component({
  selector: 'app-toast-example',
  imports: [ToastContainerComponent, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-toast-container></app-toast-container>
    <button appButton type="button" (click)="ok()">{{ en ? 'Success' : 'Sucesso' }}</button>
    <button appButton="outline" tone="danger" type="button" (click)="fail()">{{ en ? 'Error' : 'Erro' }}</button>
  `,
  styles: STATUS
})
export class ToastExampleComponent {
  readonly isEn = injectIsEn();
  private readonly toast = inject(ToastService);

  ok() { this.toast.success(this.isEn() ? 'Card requested successfully.' : 'Cartão solicitado com sucesso.'); }
  fail() { this.toast.error(this.isEn() ? 'Could not request the card.' : 'Falha ao solicitar cartão.', { duration: 7000 }); }
}
