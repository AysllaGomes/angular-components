import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';

import { ColumnDef } from '../../model/interface/column-def.interface';

import { TableActionsTemplateDirective, TableCellTemplateDirective } from './table.directives';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T = any> implements AfterContentInit {
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];

  /** Mostra coluna de seleção por checkbox */
  @Input() selectable = false;

  /** Mostra coluna de ações (usa slot appActions) */
  @Input() showActions = false;

  /** linhas selecionadas por índice */
  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  /** evento para ações padrão (se você quiser escutar) */
  @Output() action = new EventEmitter<{ type: string; row: T; index: number }>();

  @ContentChildren(TableCellTemplateDirective) cellTemplates!: QueryList<TableCellTemplateDirective>;
  @ContentChild(TableActionsTemplateDirective) actionsTpl?: TableActionsTemplateDirective;

  private cellTplMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit(): void {
    this.cellTplMap.clear();
    this.cellTemplates?.forEach((d) => this.cellTplMap.set(String(d.name), d.tpl));
  }

  getTemplate(name: string): TemplateRef<any> | null {
    return this.cellTplMap.get(String(name)) ?? null;
  }

  // ===== seleção =====
  isSelected(i: number) {
    return this.selected.includes(i);
  }

  toggleRow(i: number, checked: boolean) {
    const set = new Set(this.selected);
    if (checked) set.add(i); else set.delete(i);
    this.selected = [...set].sort((a,b)=>a-b);
    this.selectedChange.emit(this.selected);
  }

  get allSelected() {
    return this.data.length > 0 && this.selected.length === this.data.length;
  }

  toggleAll(checked: boolean) {
    this.selected = checked ? this.data.map((_, i) => i) : [];
    this.selectedChange.emit(this.selected);
  }

  // ===== chip helpers =====
  chipLabel(col: ColumnDef<T>, value: any): string {
    if (!col.chipMap) return String(value ?? '');
    const entry = col.chipMap[String(value)] ?? { label: String(value ?? '') };
    return entry.label;
  }

  chipClass(col: ColumnDef<T>, value: any): string {
    if (!col.chipMap) return 'chip';
    const entry = col.chipMap[String(value)];
    const variant = entry?.variant ? ` chip--${entry.variant}` : '';
    return `chip${variant}`;
  }

  trackByIndex = (_: number, __: unknown) => _;
  protected readonly String = String;
}
