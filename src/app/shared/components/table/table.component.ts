import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';

import { ActionKind } from '../../model/type/action-kind.type';

import { ColumnDef } from '../../model/interface/column-def.interface';
import { TableAction } from '../../model/interface/table-action.interface';

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
  @Input() actions: (TableAction<T> | ActionKind)[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];

  @Input() loading = false;
  @Input() loadingRows = 5;
  @Input() emptyMessage = 'Nenhum registro encontrado';
  @Input() sortKey?: string;
  @Input() sortDir: 'asc'|'desc' = 'asc';

  /** Largura da coluna de seleção (checkbox). Aceita "36px", 36, "2.5rem"... */
  @Input() selectColWidth: string | number = 36;

  /** Largura da coluna de ações (opcional) */
  @Input() actionsColWidth: string | number = 44;

  /** Mostra coluna de seleção por checkbox */
  @Input() selectable = false;

  /** Mostra coluna de ações (usa slot appActions) */
  @Input() showActions = false;

  /**
   * Identificador estável da linha (nome da propriedade ou função).
   * Com ele, `selected` guarda **chaves** em vez de índices, e a seleção
   * sobrevive a ordenação, paginação e filtros feitos fora da tabela.
   */
  @Input() rowKey?: keyof T | ((row: T, index: number) => unknown);

  /** Linhas selecionadas: chaves (com `rowKey`) ou índices em `data` (sem `rowKey`). */
  @Input() selected: any[] = [];
  @Output() selectedChange = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<{ key: string; dir: 'asc'|'desc' }>();

  /** evento para ações padrão (se você quiser escutar) */
  @Output() action = new EventEmitter<{ type: string; row: T; index: number }>();

  @ContentChildren(TableCellTemplateDirective) cellTemplates!: QueryList<TableCellTemplateDirective>;
  @ContentChild(TableActionsTemplateDirective) actionsTpl?: TableActionsTemplateDirective;

  get skeletonArray() {
    return Array.from({ length: Math.max(1, this.loadingRows) });
  }

  private cellTplMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit(): void {
    this.cellTplMap.clear();
    this.cellTemplates?.forEach((d) => this.cellTplMap.set(String(d.name), d.tpl));
  }

  getTemplate(name: string): TemplateRef<any> | null {
    return this.cellTplMap.get(String(name)) ?? null;
  }

  // ===== seleção =====
  /** Chave da linha usada na seleção e no trackBy (índice quando não há `rowKey`). */
  rowId(row: T, i: number): unknown {
    const k = this.rowKey;
    if (k == null) return i;
    return typeof k === 'function' ? k(row, i) : row[k];
  }

  private get pageIds(): unknown[] {
    return this.data.map((row, i) => this.rowId(row, i));
  }

  private get selectedOnPage(): number {
    return this.pageIds.filter(id => this.selected.includes(id)).length;
  }

  isSelected(row: T, i: number) {
    return this.selected.includes(this.rowId(row, i));
  }

  toggleRow(row: T, i: number, checked: boolean) {
    const id = this.rowId(row, i);
    const rest = this.selected.filter(s => s !== id);
    const next = checked ? [...rest, id] : rest;
    // sem rowKey mantém o comportamento original (índices ordenados)
    this.selected = this.rowKey == null ? next.sort((a, b) => a - b) : next;
    this.selectedChange.emit(this.selected);
  }

  get allSelected() {
    return this.data.length > 0 && this.selectedOnPage === this.data.length;
  }

  get someSelected() {
    const n = this.selectedOnPage;
    return n > 0 && n < this.data.length;
  }

  /**
   * Marca/desmarca as linhas visíveis. Com `rowKey`, chaves de linhas que
   * não estão em `data` (ex.: outras páginas) são preservadas.
   */
  toggleAll(checked: boolean) {
    const ids = this.pageIds;
    const rest = this.rowKey == null ? [] : this.selected.filter(s => !ids.includes(s));
    this.selected = checked ? [...rest, ...ids] : rest;
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

  get normalizedActions(): TableAction<T>[] {
    return (this.actions ?? []).map(a => typeof a === 'string' ? ({ kind: a }) : a);
  }

  get hasActions(): boolean {
    // renderiza a coluna se: showActions=true OU foram passadas actions OU existe template projetado
    return !!(this.showActions || (this.actions && this.actions.length) || this.actionsTpl);
  }

  isActionDisabled(a: TableAction<T>, row: T, index: number) {
    return a.disabled ? !!a.disabled(row, index) : false;
  }

  emitAction(kind: ActionKind, row: T, index: number) {
    this.action.emit({ type: kind, row, index });
  }

  onHeaderClick(col: ColumnDef<T>) {
    if (!col.key || col.type === 'custom') return;
    const key = String(col.key);
    const dir = (this.sortKey === key && this.sortDir === 'asc') ? 'desc' : 'asc';
    this.sortKey = key; this.sortDir = dir;
    this.sortChange.emit({ key, dir });
  }

  toCssUnit(v: string | number): string {
    return typeof v === 'number' ? `${v}px` : v;
  }

  get selectW(): string { return this.toCssUnit(this.selectColWidth); }
  get actionsW(): string { return this.toCssUnit(this.actionsColWidth); }

  trackByRow = (i: number, row: T) => this.rowId(row, i);
  trackByCol = (_: number, c: ColumnDef) => c.key as string;
  protected readonly String = String;
}
