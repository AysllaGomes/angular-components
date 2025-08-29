import { Component, signal } from '@angular/core';

import { StepItem } from '../../../shared/model/interface/step-item.interface';

import { StepperComponent } from '../../../shared/components/stepper/stepper.component';


@Component({
  selector: 'app-stepper-demo',
  standalone: true,
  imports: [StepperComponent],
  templateUrl: './stepper-demo.component.html',
  styleUrl: './stepper-demo.component.sass'
})
export class StepperDemoComponent {
  // básico
  steps: StepItem[] = [
    { label: 'Entrega', caption: 'Confira o endereço' },
    { label: 'Produto', caption: 'Defina o cartão' },
    { label: 'Personalização', caption: 'Personalize o cartão' },
    { label: 'Adicional', caption: 'Configure os adicionais' },
    { label: 'Resumo', caption: 'Confira a solicitação' }
  ];
  current = signal(0);
  goTo = (i: number) => this.current.set(i);
  next = () => this.current.update(v => Math.min(v + 1, this.steps.length - 1));
  prev = () => this.current.update(v => Math.max(v - 1, 0));

  // com etapa desabilitada
  stepsDisabled: StepItem[] = [
    { label: 'Etapa 1' }, { label: 'Etapa 2' }, { label: 'Etapa 3', state: 'disabled' }, { label: 'Etapa 4' }
  ];
  current2 = signal(1);
}
