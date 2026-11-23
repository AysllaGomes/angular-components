import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  TemplateRef,
  afterRenderEffect,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild
} from '@angular/core';

import { ActionKind } from '../../model/type/action-kind.type';
import { SortDir } from '../../model/type/sort-dir.type';

import { ColumnDef } from '../../model/interface/column-def.interface';
import { TableAction } from '../../model/interface/table-action.interface';
import { TableBulkAction, TableBulkBarIdle } from '../../model/interface/table-bulk-action.interface';

import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TableBulkBarComponent } from './table-bulk-bar.component';
import {
  TableActionsTemplateDirective,
  TableBulkActionsContext,
  TableBulkActionsTemplateDirective,
  TableCellTemplateDirective
} from './table.directives';

/** nome padrão das ações declarativas sem `ariaLabel`/`label` */
const DEFAULT_ACTION_LABELS: Record<ActionKind, string> = {
  edit: 'Editar',
  delete: 'Excluir',
  view: 'Visualizar',
  download: 'Baixar',
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet, TooltipDirective, TableBulkBarComponent],
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

  /**
   * Falha ao buscar os dados: com uma mensagem, a tabela mostra o erro (anunciado ao
   * leitor de tela) no lugar das linhas e do "vazio". `loading` continua vencendo,
   * então dá para manter a mensagem enquanto tenta de novo.
   */
  readonly error = input<string | null | undefined>(null);
  /** texto do botão que emite `retry`; vazio ou `null` esconde o botão */
  readonly retryLabel = input<string | null>('Tentar novamente');
  /** o usuário pediu para buscar de novo */
  readonly retry = output<void>();

  /** o que o corpo da tabela mostra (precedência: carregando > erro > dados > vazio) */
  readonly state = computed<'loading' | 'error' | 'data' | 'empty'>(() => {
    if (this.loading()) return 'loading';
    if (this.error()?.trim()) return 'error';
    return this.data().length > 0 ? 'data' : 'empty';
  });

  /** Ordenação controlada pelo container (o clique no cabeçalho atualiza o estado local e emite `sortChange`). */
  readonly sortKey = input<string | undefined>(undefined);
  readonly sortDir = input<SortDir>('asc');
  readonly activeSortKey = linkedSignal(() => this.sortKey());
  readonly activeSortDir = linkedSignal(() => this.sortDir());

  /** Largura da coluna de seleção (checkbox). Aceita "36px", 36, "2.5rem"... */
  readonly selectColWidth = input<string | number>(36);

  /** Largura da coluna de ações (opcional) */
  readonly actionsColWidth = input<string | number>(44);

  /** nome da coluna de ações para leitor de tela (o cabeçalho é visualmente vazio) */
  readonly actionsLabel = input('Ações');

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

  // ===== ações em massa =====
  /** botões da barra de ações em massa (exige `selectable`) */
  readonly bulkActions = input<TableBulkAction[]>([]);
  /**
   * Barra sem seleção: `'space'` não mostra nada mas guarda o espaço (a tabela não pula),
   * `'hint'` mostra `noSelectionLabel`, `'hidden'` só aparece com seleção (a tabela desce).
   */
  readonly bulkBarIdle = input<TableBulkBarIdle>('space');
  /** nome do grupo da barra para leitor de tela */
  readonly bulkActionsLabel = input('Ações em massa');
  /** texto do contador (também anunciado ao leitor de tela a cada mudança) */
  readonly selectedCountLabel = input<(n: number) => string>(
    n => (n === 1 ? '1 selecionado' : `${n} selecionados`)
  );
  /** texto sem seleção: visível com `bulkBarIdle="hint"`; nos outros modos só é anunciado ao limpar */
  readonly noSelectionLabel = input('Nenhuma linha selecionada');
  readonly clearSelectionLabel = input('Limpar seleção');
  /** clique numa ação em massa: chaves (com `rowKey`) ou índices em `data` */
  readonly bulkAction = output<{ type: string; keys: any[] }>();

  private readonly cellTemplates = contentChildren(TableCellTemplateDirective);
  readonly actionsTpl = contentChild(TableActionsTemplateDirective);
  readonly bulkTpl = contentChild(TableBulkActionsTemplateDirective);

  /** a tabela tem barra de ações em massa (declarativa ou `appBulkActions`) */
  readonly hasBulk = computed(() =>
    this.selectable() && (this.bulkActions().length > 0 || !!this.bulkTpl())
  );
  readonly selectedCount = computed(() => this.selection().length);
  readonly selectedCountText = computed(() =>
    this.selectedCount() > 0 ? this.selectedCountLabel()(this.selectedCount()) : this.noSelectionLabel()
  );
  readonly bulkCtx = computed<TableBulkActionsContext>(() => {
    const keys = [...this.selection()];
    return { $implicit: keys, keys, count: keys.length, clear: () => this.clearSelection() };
  });

  /** templates `appCell` por nome de coluna */
  private readonly cellTplMap = computed(() =>
    new Map(this.cellTemplates().map(d => [String(d.name()), d.tpl] as const))
  );

  private readonly doc = inject(DOCUMENT);
  private readonly tableEl = viewChild<ElementRef<HTMLTableElement>>('tbl');
  private readonly retryBtn = viewChild<ElementRef<HTMLButtonElement>>('retryBtn');
  private readonly selectAllEl = viewChild<ElementRef<HTMLInputElement>>('selectAll');
  private readonly bulkBarEl = viewChild(TableBulkBarComponent, { read: ElementRef });
  /** o foco estava na barra de ações em massa (os botões somem ao limpar a seleção) */
  private bulkHadFocus = false;
  /** clicou em "Tentar novamente" e o resultado ainda não chegou */
  private readonly retryPending = signal(false);
  /** já passou por `loading` desde o clique (senão o retry não buscou de novo) */
  private retrySawLoading = false;

  constructor() {
    // O botão some enquanto carrega: sem isso o foco cairia no <body>.
    // Carregando ou deu certo → foco na tabela; falhou de novo → no botão.
    afterRenderEffect(() => {
      const state = this.state();
      const btn = this.retryBtn()?.nativeElement;
      if (!this.retryPending()) return;

      if (state === 'error') {
        // Ainda em erro sem ter carregado: o (retry) não ligou o `loading`.
        // O botão continua com o foco; só encerra, para a flag não ficar presa.
        if (this.retrySawLoading) btn?.focus();
        this.endRetry();
        return;
      }
      const active = this.doc.activeElement;
      if (!active || active === this.doc.body) this.tableEl()?.nativeElement.focus();
      if (state === 'loading') this.retrySawLoading = true;
      else this.endRetry();
    });

    // Os botões da barra somem quando a seleção fica vazia ("Limpar seleção", ou o container
    // limpou depois de uma ação): o foco ficaria num botão invisível ou no <body>.
    // Vai para "Selecionar tudo" (ou a tabela).
    afterRenderEffect(() => {
      const hasSelection = this.selectedCount() > 0;
      const selectAll = this.selectAllEl()?.nativeElement;
      if (hasSelection || !this.bulkHadFocus) return;
      this.bulkHadFocus = false;
      const active = this.doc.activeElement;
      const bar = this.bulkBarEl()?.nativeElement as HTMLElement | undefined;
      if (active && active !== this.doc.body && !bar?.contains(active)) return;
      if (selectAll && !selectAll.disabled) selectAll.focus();
      else this.tableEl()?.nativeElement.focus();
    });
  }

  onBulkFocusIn() { this.bulkHadFocus = true; }

  /** só sai da barra quando o foco foi para outro elemento (sem destino: removido ou clique no vazio) */
  onBulkFocusOut(e: FocusEvent) {
    const bar = e.currentTarget as HTMLElement;
    const to = e.relatedTarget as Node | null;
    if (to && !bar.contains(to)) this.bulkHadFocus = false;
  }

  clearSelection() {
    if (this.selection().length) this.updateSelection([]);
  }

  onRetry() {
    this.retrySawLoading = false;
    this.retryPending.set(true);
    this.retry.emit();
  }

  private endRetry() {
    this.retrySawLoading = false;
    this.retryPending.set(false);
  }

  /** colunas ocupadas pelas linhas de estado (vazio/erro) */
  get colspan(): number {
    return this.columns().length + (this.selectable() ? 1 : 0) + (this.hasActions ? 1 : 0);
  }

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

  isActionVisible(a: TableAction<T>, row: T, index: number) {
    return a.visible ? !!a.visible(row, index) : true;
  }

  isActionDisabled(a: TableAction<T>, row: T, index: number) {
    return a.disabled ? !!a.disabled(row, index) : false;
  }

  /**
   * Nome do botão, que é também a dica: `ariaLabel` > `label` > padrão do `kind`.
   * Desabilitada com `disabledReason`, o motivo vem junto: "Excluir (Titular não pode ser excluído)".
   */
  actionTooltip(a: TableAction<T>, row: T, index: number): string {
    const name = a.ariaLabel || a.label || DEFAULT_ACTION_LABELS[a.kind] || a.kind;
    const reason = this.isActionDisabled(a, row, index) ? a.disabledReason?.(row, index)?.trim() : '';
    return reason ? `${name} (${reason})` : name;
  }

  onActionClick(e: Event, a: TableAction<T>, row: T, index: number) {
    if (this.isActionDisabled(a, row, index)) {
      e.preventDefault();
      return;
    }
    this.emitAction(a.kind, row, index);
  }

  emitAction(kind: ActionKind, row: T, index: number) {
    this.action.emit({ type: kind, row, index });
  }

  /** colunas com dado simples podem ser ordenadas (custom não) */
  isSortable(col: ColumnDef<T>) { return !!col.key && col.type !== 'custom'; }

  onHeaderClick(col: ColumnDef<T>) {
    if (!this.isSortable(col)) return;
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
