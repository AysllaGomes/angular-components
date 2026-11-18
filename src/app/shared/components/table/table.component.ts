import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  input,
  linkedSignal,
  output
} from '@angular/core';

import { ActionKind } from '../../model/type/action-kind.type';
import { SortDir } from '../../model/type/sort-dir.type';

import { ColumnDef } from '../../model/interface/column-def.interface';
import { TableAction } from '../../model/interface/table-action.interface';

import { TableActionsTemplateDirective, TableCellTemplateDirective } from './table.directives';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T = any> {
  readonly data = input.required<T[]>();
  readonly actions = input<(TableAction<T> | ActionKind)[]>([]);
  readonly columns = input.required<ColumnDef<T>[]>();

  readonly loading = input(false);
  readonly loadingRows = input(5);
  readonly emptyMessage = input('Nenhum registro encontrado');

  /** Ordenação controlada pelo container (o clique no cabeçalho atualiza o estado local e emite `sortChange`). */
  readonly sortKey = input<string | undefined>(undefined);
  readonly sortDir = input<SortDir>('asc');
  readonly activeSortKey = linkedSignal(() => this.sortKey());
  readonly activeSortDir = linkedSignal(() => this.sortDir());

  /** Largura da coluna de seleção (checkbox). Aceita "36px", 36, "2.5rem"... */
  readonly selectColWidth = input<string | number>(36);

  /** Largura da coluna de ações (opcional) */
  readonly actionsColWidth = input<string | number>(44);

  /** Mostra coluna de seleção por checkbox */
  readonly selectable = input(false);

  /** Mostra coluna de ações (usa slot appActions) */
  readonly showActions = input(false);

  /**
   * Identificador estável da linha (nome da propriedade ou função).
   * Com ele, `selected` guarda **chaves** em vez de índices, e a seleção
   * sobrevive a ordenação, paginação e filtros feitos fora da tabela.
   */
  readonly rowKey = input<keyof T | ((row: T, index: number) => unknown)>();

  /** Linhas selecionadas: chaves (com `rowKey`) ou índices em `data` (sem `rowKey`). */
  readonly selected = input<any[]>([]);
  /** seleção atual: segue o input `selected` e é atualizada pelos checkboxes */
  private readonly selection = linkedSignal(() => this.selected());

  readonly selectedChange = output<any[]>();
  readonly sortChange = output<{ key: string; dir: SortDir }>();

  /** evento para ações padrão (se você quiser escutar) */
  readonly action = output<{ type: string; row: T; index: number }>();

  private readonly cellTemplates = contentChildren(TableCellTemplateDirective);
  readonly actionsTpl = contentChild(TableActionsTemplateDirective);

  /** templates `appCell` por nome de coluna */
  private readonly cellTplMap = computed(() =>
    new Map(this.cellTemplates().map(d => [String(d.name()), d.tpl] as const))
  );

  get skeletonArray() {
    return Array.from({ length: Math.max(1, this.loadingRows()) });
  }

  getTemplate(name: string): TemplateRef<any> | null {
    return this.cellTplMap().get(String(name)) ?? null;
  }

  // ===== seleção =====
  /** Chave da linha usada na seleção e no `track` do @for (índice quando não há `rowKey`). */
  rowId(row: T, i: number): unknown {
    const k = this.rowKey();
    if (k == null) return i;
    return typeof k === 'function' ? k(row, i) : row[k];
  }

  private get pageIds(): unknown[] {
    return this.data().map((row, i) => this.rowId(row, i));
  }

  private get selectedOnPage(): number {
    const sel = this.selection();
    return this.pageIds.filter(id => sel.includes(id)).length;
  }

  isSelected(row: T, i: number) {
    return this.selection().includes(this.rowId(row, i));
  }

  toggleRow(row: T, i: number, checked: boolean) {
    const id = this.rowId(row, i);
    const rest = this.selection().filter(s => s !== id);
    const next = checked ? [...rest, id] : rest;
    // sem rowKey mantém o comportamento original (índices ordenados)
    this.updateSelection(this.rowKey() == null ? next.sort((a, b) => a - b) : next);
  }

  get allSelected() {
    const len = this.data().length;
    return len > 0 && this.selectedOnPage === len;
  }

  get someSelected() {
    const n = this.selectedOnPage;
    return n > 0 && n < this.data().length;
  }

  /**
   * Marca/desmarca as linhas visíveis. Com `rowKey`, chaves de linhas que
   * não estão em `data` (ex.: outras páginas) são preservadas.
   */
  toggleAll(checked: boolean) {
    const ids = this.pageIds;
    const rest = this.rowKey() == null ? [] : this.selection().filter(s => !ids.includes(s));
    this.updateSelection(checked ? [...rest, ...ids] : rest);
  }

  private updateSelection(next: any[]) {
    this.selection.set(next);
    this.selectedChange.emit(next);
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
    return (this.actions() ?? []).map(a => typeof a === 'string' ? ({ kind: a }) : a);
  }

  get hasActions(): boolean {
    // renderiza a coluna se: showActions=true OU foram passadas actions OU existe template projetado
    const actions = this.actions();
    return !!(this.showActions() || (actions && actions.length) || this.actionsTpl());
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
    const dir: SortDir = (this.activeSortKey() === key && this.activeSortDir() === 'asc') ? 'desc' : 'asc';
    this.activeSortKey.set(key);
    this.activeSortDir.set(dir);
    this.sortChange.emit({ key, dir });
  }

  toCssUnit(v: string | number): string {
    return typeof v === 'number' ? `${v}px` : v;
  }

  get selectW(): string { return this.toCssUnit(this.selectColWidth()); }
  get actionsW(): string { return this.toCssUnit(this.actionsColWidth()); }

  protected readonly String = String;
}
