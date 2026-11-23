import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, input, output } from '@angular/core';

import { TableBulkAction } from '../../model/interface/table-bulk-action.interface';

import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TableBulkActionsContext } from './table.directives';

/**
 * Barra de ações em massa da `app-table` (uso interno): contador, "Limpar seleção"
 * e os botões de `[bulkActions]` ou do slot `appBulkActions`.
 * O foco ao sumir fica com a tabela, que sabe para onde levá-lo.
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
    '[attr.aria-label]': 'label()'
  }
})
export class TableBulkBarComponent {
  readonly label = input.required<string>();
  readonly countText = input.required<string>();
  readonly clearLabel = input.required<string>();
  readonly actions = input<TableBulkAction[]>([]);
  readonly keys = input.required<any[]>();
  readonly tpl = input<TemplateRef<TableBulkActionsContext> | null | undefined>(null);
  readonly ctx = input.required<TableBulkActionsContext>();

  readonly clear = output<void>();
  readonly action = output<{ type: string; keys: any[] }>();

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
