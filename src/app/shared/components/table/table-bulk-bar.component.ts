import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, input, output } from '@angular/core';

import { TableBulkAction, TableBulkBarIdle } from './table.types';

import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TableBulkActionsContext } from './table.directives';

/**
 * Barra de ações em massa da `app-table` (uso interno): contador, "Limpar seleção"
 * e os botões de `[bulkActions]` ou do slot `appBulkActions`.
 * Fica sempre no lugar; sem seleção, só o texto aparece. Quando os botões somem,
 * o foco fica com a tabela, que sabe para onde levá-lo.
 */
@Component({
  selector: 'app-table-bulk-bar',
  imports: [NgTemplateOutlet, TooltipDirective],
  templateUrl: './table-bulk-bar.component.html',
  styleUrl: './table-bulk-bar.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bulk-bar',
    role: 'group',
    '[attr.aria-label]': 'label()',
    '[class.is-idle]': 'count() === 0',
    '[attr.data-idle]': 'idle()'
  }
})
export class TableBulkBarComponent {
  readonly label = input.required<string>();
  /** sem seleção (0), só o texto fica visível; "Limpar" e as ações guardam o espaço */
  readonly count = input.required<number>();
  /** o que aparece sem seleção (ver `bulkBarIdle` na tabela) */
  readonly idle = input<TableBulkBarIdle>('space');
  readonly countText = input.required<string>();
  readonly clearLabel = input.required<string>();
  /** as da tabela, com o tipo de chave dela (que este componente interno não conhece) */
  readonly actions = input<TableBulkAction<any>[]>([]);
  readonly keys = input.required<unknown[]>();
  readonly tpl = input<TemplateRef<TableBulkActionsContext> | null | undefined>(null);
  readonly ctx = input.required<TableBulkActionsContext>();

  readonly clear = output<void>();
  readonly action = output<{ type: string; keys: unknown[] }>();

  isDisabled(a: TableBulkAction): boolean {
    return a.disabled ? !!a.disabled([...this.keys()]) : false;
  }

  /** motivo da ação indisponível, mostrado na dica (descrição do botão) */
  reason(a: TableBulkAction): string {
    return this.isDisabled(a) ? (a.disabledReason?.([...this.keys()])?.trim() ?? '') : '';
  }

  onClick(e: Event, a: TableBulkAction) {
    if (this.isDisabled(a)) {
      e.preventDefault();
      return;
    }
    this.action.emit({ type: a.type, keys: [...this.keys()] });
  }
}
