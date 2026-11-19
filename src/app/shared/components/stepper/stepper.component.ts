import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { StepState } from '../../model/type/step-state.type';

import { StepItem } from '../../model/interface/step-item.interface';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent {
  readonly steps = input.required<StepItem[]>();

  /** nome da navegação para leitores de tela */
  readonly ariaLabel = input('Etapas do fluxo');
  /** texto (só para leitor de tela) anexado às etapas concluídas */
  readonly doneLabel = input('concluída');

  /** Índice base-0 da etapa ativa */
  readonly current = input(0);

  /** Permite clicar em etapas (limite: até a última concluída + 1) */
  readonly clickable = input(true);

  /** Exibir números dentro dos círculos */
  readonly showIndex = input(true);

  /** Mostrar legendas (caption) abaixo do label */
  readonly showCaption = input(true);

  /** Emite quando o usuário clica em uma etapa válida */
  readonly stepChange = output<number>();

  /** cálculo de estado visual */
  getState(i: number): StepState {
    if (this.steps()[i]?.state === 'disabled') return 'disabled';
    if (i < this.current()) return 'done';
    if (i === this.current()) return 'active';
    return 'pending';
  }

  /** Qual a maior etapa alcançável para navegação por clique */
  private get maxReachableIndex(): number {
    // permite voltar para anteriores e avançar para a próxima imediata
    return Math.max(this.current() + 1, 0);
  }

  canClick(i: number): boolean {
    if (!this.clickable()) return false;
    const state = this.getState(i);
    if (state === 'disabled') return false;
    // você pode sempre voltar para as anteriores; avançar no máx até a próxima
    return i <= this.maxReachableIndex;
  }

  onStepClick(i: number): void {
    if (!this.canClick(i) || i === this.current()) return;
    this.stepChange.emit(i);
  }

}
