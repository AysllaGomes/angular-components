import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectIsEn } from './lang';
import { TABS_IMPORTS } from '../../shared/components/tabs';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { StepItem } from '../../shared/components/stepper/stepper.types';
import { ButtonDirective } from '../../shared/components/button/button.directive';

/*
 * Exemplos ao vivo do grupo Navegação e ações. Cada um reproduz o exemplo de "Uso"
 * do .md (o que a aba "Código" mostra), no idioma da página.
 */

/** tabs.md → ## Uso */
@Component({
  selector: 'app-tabs-example',
  imports: [...TABS_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-tabs [ariaLabel]="en ? 'Account' : 'Conta'" [(selected)]="tab">
      <app-tab [key]="en ? 'profile' : 'perfil'" [label]="en ? 'Profile' : 'Perfil'">
        <p>{{ en ? 'Name, email and photo of the account.' : 'Nome, e-mail e foto da conta.' }}</p>
      </app-tab>
      <app-tab [key]="en ? 'orders' : 'pedidos'" [label]="en ? 'Orders' : 'Pedidos'" [badge]="pending()">
        <p>{{ en ? '3 orders waiting for payment.' : '3 pedidos aguardando pagamento.' }}</p>
      </app-tab>
      <app-tab [key]="en ? 'archive' : 'arquivo'" [label]="en ? 'Archive' : 'Arquivo'" disabled />
    </app-tabs>
  `,
  styles: `
p
  margin: 1rem 0 0
  color: var(--muted, #5f6a75)
`
})
export class TabsExampleComponent {
  readonly isEn = injectIsEn();
  readonly tab = signal<string | null>(null);
  readonly pending = signal(3);
}

/** stepper.md → ## Uso */
@Component({
  selector: 'app-stepper-example',
  imports: [StepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-stepper
      [steps]="steps()"
      [current]="current()"
      [clickable]="true"
      [showIndex]="true"
      [showCaption]="true"
      (stepChange)="goTo($event)">
    </app-stepper>
  `
})
export class StepperExampleComponent {
  readonly isEn = injectIsEn();
  readonly current = signal(0);
  readonly steps = computed<StepItem[]>(() => this.isEn()
    ? [
      { label: 'Delivery', caption: 'Check the address' },
      { label: 'Product', caption: 'Choose the card' },
      { label: 'Customization', caption: 'Customize the card' },
      { label: 'Additional', caption: 'Set up extra cards' },
      { label: 'Summary', caption: 'Review the request' },
    ]
    : [
      { label: 'Entrega', caption: 'Confira o endereço' },
      { label: 'Produto', caption: 'Defina o cartão' },
      { label: 'Personalização', caption: 'Personalize o cartão' },
      { label: 'Adicional', caption: 'Configure os adicionais' },
      { label: 'Resumo', caption: 'Confira a solicitação' },
    ]);

  goTo(i: number) { this.current.set(i); }
}

/** button.md → ## Uso */
@Component({
  selector: 'app-button-example',
  imports: [ButtonDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <button appButton type="button">{{ en ? 'Save' : 'Salvar' }}</button>
    <button appButton="ghost" tone="neutral" type="button">{{ en ? 'Back' : 'Voltar' }}</button>
    <button appButton="outline" tone="danger" type="button">{{ en ? 'Delete' : 'Excluir' }}</button>
    <button appButton [busy]="saving()" type="button" (click)="send()">{{ en ? 'Send' : 'Enviar' }}</button>
    <a appButton variant="link" routerLink="/demo" fragment="button">{{ en ? 'Learn more' : 'Saiba mais' }}</a>
  `,
  styles: `
:host
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: .75rem
`
})
export class ButtonExampleComponent {
  readonly isEn = injectIsEn();
  readonly saving = signal(false);

  /** "Enviar" mostra o estado ocupado por 1,5 s */
  send() {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }
}
