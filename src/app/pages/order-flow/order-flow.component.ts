import { Component, signal } from '@angular/core';

import { StepItem } from '../../shared/model/interface/step-item.interface';

import { StepperComponent } from '../../shared/components/stepper/stepper.component';

@Component({
  selector: 'app-order-flow',
  standalone: true,
  templateUrl: './order-flow.component.html',
  styleUrl: './order-flow.component.sass',
  imports: [StepperComponent],
})
export class OrderFlowComponent {
  steps: StepItem[] = [
    { label: 'Entrega',         caption: 'Confira o endereço' },
    { label: 'Produto',         caption: 'Defina o cartão' },
    { label: 'Personalização',  caption: 'Personalize o cartão' },
    { label: 'Adicional',       caption: 'Configure os adicionais' },
    { label: 'Resumo',          caption: 'Confira a solicitação' }
  ];

  current = signal(0);

  goTo(i: number) { this.current.set(i); }
  next() { this.current.update(v => Math.min(v + 1, this.steps.length - 1)); }
  prev() { this.current.update(v => Math.max(v - 1, 0)); }
}
