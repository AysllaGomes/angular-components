import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  TemplateRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core';

import { ActionKind } from '../../model/type/action-kind.type';
import { SortDir } from '../../model/type/sort-dir.type';

import { ColumnDef } from '../../model/interface/column-def.interface';
import { TableAction } from '../../model/interface/table-action.interface';
import { TableBulkAction, TableBulkBarIdle } from '../../model/interface/table-bulk-action.interface';

import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TableBulkBarComponent } from './table-bulk-bar.component';
import { TableFooterComponent } from './table-footer.component';
import { TableDetailComponent } from './table-detail.component';
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
  imports: [NgTemplateOutlet, TooltipDirective, TableBulkBarComponent, TableFooterComponent, TableDetailComponent],
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

  // ===== paginação =====
  /**
   * Liga a paginação integrada (rodapé com total, itens por página e páginas):
   * - `'client'`: `data` tem todas as linhas e a tabela mostra a fatia da página;
   * - `'server'`: `data` já é a página atual e o total vem de `totalItems`.
   * Sem ela (padrão), a tabela mostra `data` inteiro, como antes.
   */
  readonly paginate = input<'client' | 'server' | null>(null);
  /** página atual (0-based); aceita `[(pageIndex)]` */
  readonly pageIndex = model(0);
  /** linhas por página; aceita `[(pageSize)]` */
  readonly pageSize = model(10);
  /** total de linhas no servidor (`paginate="server"`) */
  readonly totalItems = input<number | null>(null);
  /** opções do seletor "Itens por página"; vazio (padrão) esconde o seletor */
  readonly pageSizeOptions = input<number[]>([]);
  readonly rangeLabel = input<(start: number, end: number, total: number) => string>(
    (s, e, t) => `Mostrando ${s}–${e} de ${t}`
  );
  readonly pageSizeLabel = input('Itens por página');
  readonly paginationLabel = input('Paginação da tabela');

  /** linhas por página válidas (inteiro ≥ 1) */
  readonly size = computed(() => {
    const n = Math.floor(Number(this.pageSize()));
    return Number.isFinite(n) && n > 0 ? n : 10;
  });
  readonly totalCount = computed(() => {
    const p = this.paginate();
    if (p === 'server') return Math.max(0, Number(this.totalItems() ?? this.data().length) || 0);
    return this.data().length;
  });
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.size())));
  /** página atual limitada ao intervalo válido */
  readonly currentPage = computed(() => {
    const i = Math.floor(Number(this.pageIndex()) || 0);
    return Math.min(Math.max(0, i), this.pageCount() - 1);
  });
  /** posição em `data` da primeira linha visível (só no modo local a tabela fatia) */
  readonly offset = computed(() => (this.paginate() === 'client' ? this.currentPage() * this.size() : 0));
  /** linhas na tela */
  readonly rows = computed(() => {
    const data = this.data();
    if (this.paginate() !== 'client') return data;
    return data.slice(this.offset(), this.offset() + this.size());
  });
  readonly rangeText = computed(() => {
    const total = this.totalCount();
    const first = this.currentPage() * this.size();
    const shown = this.paginate() === 'client' ? this.rows().length : Math.min(this.data().length, this.size());
    return this.rangeLabel()(total ? first + 1 : 0, total ? Math.min(first + shown, total) : 0, total);
  });
  /** rodapé: com paginação, sem erro e com algo para contar */
  readonly showFooter = computed(() => !!this.paginate() && this.state() !== 'error' && this.totalCount() > 0);

  // ===== colunas que se recolhem =====
  /** nome da coluna do botão de detalhes, para leitor de tela */
  readonly detailsLabel = input('Detalhes');
  /** nome do botão que abre a linha com as colunas escondidas */
  readonly expandLabel = input('Mostrar detalhes');

  /** largura visível do wrapper (0 até medir; no servidor e sem ResizeObserver, nada se recolhe) */
  private readonly availWidth = signal(0);
  /** ≤ 640px: modo cartão, que já mostra todos os campos */
  private readonly cardMode = signal(false);
  /** colunas escondidas, na ordem em que sumiram */
  private readonly hiddenOrder = signal<string[]>([]);
  /** largura que a tabela precisava com cada coluna escondida ainda visível */
  private readonly neededWidth = new Map<string, number>();

  readonly visibleColumns = computed(() => {
    const hidden = this.hiddenOrder();
    return this.columns().filter(c => !hidden.includes(String(c.key)));
  });
  /** escondidas, na ordem das colunas (é a ordem da linha de detalhes) */
  readonly hiddenColumns = computed(() => {
    const hidden = this.hiddenOrder();
    return this.columns().filter(c => hidden.includes(String(c.key)));
  });
  readonly hasHidden = computed(() => this.hiddenColumns().length > 0);

  /** linhas com os detalhes abertos (por `rowId`) */
  private readonly expanded = signal<unknown[]>([]);
  private static nextUid = 0;
  readonly uid = `tbl-${++TableComponent.nextUid}`;

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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
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
    // Paginação local: se `data` encolheu (ex.: exclusão na última página), a página
    // atual pode não existir mais; corrige `pageIndex` (e avisa o container).
    // Carregando, não: `data` pode estar vazio só até a resposta chegar.
    effect(() => {
      if (this.paginate() !== 'client' || this.loading()) return;
      const current = this.currentPage();
      if (untracked(this.pageIndex) !== current) this.pageIndex.set(current);
    });

    // --tbl-vw: largura visível do wrapper, para o rodapé paginado ficar inteiro
    // à vista quando a tabela rola na horizontal (sticky + essa largura).
    afterNextRender(() => {
      const host = this.host.nativeElement;
      const parent = host.parentElement;
      if (!parent || typeof ResizeObserver === 'undefined') return;
      const measure = () => {
        const cs = getComputedStyle(parent);
        const w = Math.max(0, parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
        host.style.setProperty('--tbl-vw', `${w}px`);
        this.availWidth.set(w);
      };
      const ro = new ResizeObserver(measure);
      ro.observe(parent);
      measure();
      this.destroyRef.onDestroy(() => ro.disconnect());

      const mq = this.doc.defaultView?.matchMedia?.('(max-width: 640px)');
      if (mq) {
        const sync = () => this.cardMode.set(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        this.destroyRef.onDestroy(() => mq.removeEventListener('change', sync));
      }
    });

    // Colunas que se recolhem: se a tabela passa da largura visível, esconde a coluna de
    // maior `priority` e guarda a largura que precisava; com espaço de novo, ela volta.
    // Roda depois de cada render que muda largura, colunas ou conteúdo.
    afterRenderEffect(() => {
      const avail = this.availWidth();
      const order = this.hiddenOrder();
      const cols = this.columns();
      this.rows();
      this.state();
      const table = this.tableEl()?.nativeElement;
      if (!table || !avail) return;

      if (this.cardMode() || !cols.some(c => (c.priority ?? 1) > 1)) {
        if (order.length) this.hiddenOrder.set([]);
        return;
      }

      const width = table.offsetWidth;
      if (width > avail + 1) {
        const candidate = this.visibleColumns()
          .filter(c => (c.priority ?? 1) > 1)
          .reduce<ColumnDef<T> | null>((best, c) => (!best || (c.priority ?? 1) >= (best.priority ?? 1) ? c : best), null);
        if (candidate) {
          const key = String(candidate.key);
          this.neededWidth.set(key, width);
          this.hiddenOrder.set([...order, key]);
        }
        return;
      }
      const last = order.at(-1);
      if (last !== undefined && avail >= (this.neededWidth.get(last) ?? Infinity)) {
        this.hiddenOrder.set(order.slice(0, -1));
      }
    });

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

  /** colunas ocupadas pelas linhas de estado (vazio/erro) e de detalhes */
  get colspan(): number {
    return this.visibleColumns().length + (this.selectable() ? 1 : 0)
      + (this.hasHidden() ? 1 : 0) + (this.hasActions ? 1 : 0);
  }

  isExpanded(row: T, i: number): boolean {
    return this.expanded().includes(this.rowId(row, i));
  }

  toggleExpand(row: T, i: number) {
    const id = this.rowId(row, i);
    this.expanded.update(list => (list.includes(id) ? list.filter(x => x !== id) : [...list, id]));
  }

  /** id da linha de detalhes (alvo do aria-controls) */
  detailId(i: number): string {
    return `${this.uid}-detail-${i}`;
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

  /** chaves das linhas na tela; sem `rowKey`, índices em `data` (no modo local, somando o `offset`) */
  private get pageIds(): unknown[] {
    const offset = this.offset();
    return this.rows().map((row, i) => this.rowId(row, offset + i));
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
    const len = this.rows().length;
    return len > 0 && this.selectedOnPage === len;
  }

  get someSelected() {
    const n = this.selectedOnPage;
    return n > 0 && n < this.rows().length;
  }

  /**
   * Marca/desmarca as linhas visíveis. Com `rowKey`, chaves de linhas que
   * não estão em `data` (ex.: outras páginas) são preservadas. Na paginação
   * local sem `rowKey`, os índices das outras páginas também (são posições em `data`).
   */
  toggleAll(checked: boolean) {
    const ids = this.pageIds;
    const byIndex = this.rowKey() == null;
    const keepOthers = !byIndex || this.paginate() === 'client';
    const rest = keepOthers ? this.selection().filter(s => !ids.includes(s)) : [];
    const next = checked ? [...rest, ...ids] : rest;
    this.updateSelection(byIndex && keepOthers ? next.sort((a, b) => a - b) : next);
  }

  // ===== paginação =====
  goToPage(i: number) {
    if (i !== this.currentPage()) this.pageIndex.set(i);
  }

  /** troca o tamanho mantendo na tela a primeira linha que estava visível */
  onPageSize(n: number) {
    const first = this.currentPage() * this.size();
    this.pageSize.set(n);
    this.goToPage(Math.floor(first / n));
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
    // nova ordem, nova sequência: volta para a primeira página
    if (this.paginate()) this.goToPage(0);
  }

  toCssUnit(v: string | number): string {
    return typeof v === 'number' ? `${v}px` : v;
  }

  get selectW(): string { return this.toCssUnit(this.selectColWidth()); }
  get actionsW(): string { return this.toCssUnit(this.actionsColWidth()); }

  protected readonly String = String;
}
