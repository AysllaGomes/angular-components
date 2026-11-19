import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  HostListener,
  OnDestroy,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CheckState, CheckboxMarkComponent } from '../checkbox/checkbox-mark.component';
import { checkState, filterTree, indexTree, normalize, toggleLeaves, visibleLeaves } from './tree-utils';

import { ResponsiveMode } from '../../model/type/responsive-mode.type';
import { TreeNode, TreeSelectionMode } from '../../model/interface/tree-select/tree-node.interface';

let uid = 0;

/** tempo (ms) sem digitar até o typeahead recomeçar a busca */
const TYPEAHEAD_RESET_MS = 500;

/** valor: key (single) ou lista de keys das folhas (checkbox) */
export type TreeSelectValue = string | string[] | null;

/** uma linha visível do painel (árvore achatada na ordem de exibição) */
export interface TreeRow<T = unknown> {
  key: string;
  node: TreeNode<T>;
  level: number;
  posinset: number;
  setsize: number;
  hasChildren: boolean;
  expanded: boolean;
}

/**
 * Select cujas opções formam uma árvore.
 *
 * - `single`: escolhe um nó; o campo mostra o caminho ("Brasil › SP › Campinas").
 * - `checkbox`: marca vários; marcar um grupo marca as folhas dele; grupo parcial
 *   mostra "−". O valor são as keys das **folhas** marcadas (nunca a de um grupo).
 *
 * O componente só apresenta: recebe a árvore pronta e devolve keys.
 */
@Component({
  selector: 'app-tree-select',
  standalone: true,
  imports: [CheckboxMarkComponent],
  templateUrl: './tree-select.component.html',
  styleUrl: './tree-select.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TreeSelectComponent), multi: true }
  ]
})
export class TreeSelectComponent<T = unknown> implements AfterViewInit, OnDestroy, ControlValueAccessor {
  // ---- API
  readonly label = input('');
  readonly panelTitle = input<string | null>(null);
  readonly placeholder = input('');
  readonly nodes = input.required<TreeNode<T>[], TreeNode<T>[] | null | undefined>({ transform: v => v ?? [] });
  readonly selectionMode = input<TreeSelectionMode>('single');
  /** `single`: só folhas podem ser escolhidas (clicar num grupo só abre/fecha) */
  readonly leafOnly = input(false, { transform: booleanAttribute });
  /** keys dos nós que começam abertos */
  readonly expandedKeys = input<string[]>([]);
  /** separador do caminho exibido no modo `single` */
  readonly pathSeparator = input(' › ');
  /** `checkbox`: quantos chips mostrar antes do "+N" */
  readonly maxChips = input(3);

  readonly filterable = input(false, { transform: booleanAttribute });
  readonly filterPlaceholder = input('');
  readonly emptyMessage = input('Nenhum item encontrado');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly requiredLabel = input('requerido');
  readonly requiredError = input('Campo obrigatório');
  readonly autoValidate = input(true);
  /** erro externo (ex.: do formulário); tem prioridade sobre a validação interna */
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);

  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearAriaLabel = input('Limpar seleção');

  readonly responsive = input<ResponsiveMode>('auto');
  readonly sheetBreakpoint = input(560);
  readonly closeAriaLabel = input('Fechar');

  /** two-way `[(value)]`; com formulários, use `formControl`/`ngModel` */
  readonly value = input<TreeSelectValue>(null);
  readonly valueChange = output<TreeSelectValue>();

  // ---- estado
  readonly isCheckbox = computed(() => this.selectionMode() === 'checkbox');
  private readonly emptyValue = (): TreeSelectValue => this.isCheckbox() ? [] : null;

  /** valor atual: segue `value`, mas muda pelo usuário/formulário sem emitir `valueChange` */
  readonly current = linkedSignal<TreeSelectValue>(() => this.value() ?? this.emptyValue());
  readonly selected = computed<ReadonlySet<string>>(() => {
    const v = this.current();
    return new Set(Array.isArray(v) ? v : v != null && v !== '' ? [v] : []);
  });

  readonly index = computed(() => indexTree(this.nodes()));
  readonly expanded = linkedSignal(() => new Set(this.expandedKeys()));

  readonly open = signal(false);
  readonly filter = signal('');
  private readonly filtered = computed(() => this.filter().trim() ? filterTree(this.nodes(), this.filter()) : null);

  /** linhas visíveis: com filtro, tudo que combina fica aberto */
  readonly rows = computed<TreeRow<T>[]>(() => {
    const f = this.filtered();
    const open = this.expanded();
    const out: TreeRow<T>[] = [];
    const walk = (list: TreeNode<T>[], level: number) => list.forEach((node, i) => {
      const kids = f ? f.children.get(node.key) ?? [] : node.children ?? [];
      const expanded = kids.length > 0 && (!!f || open.has(node.key));
      out.push({ key: node.key, node, level, posinset: i + 1, setsize: list.length, hasChildren: kids.length > 0, expanded });
      if (expanded) walk(kids, level + 1);
    });
    walk(f ? f.roots : this.nodes(), 1);
    return out;
  });

  readonly activeKey = signal<string | null>(null);
  readonly activeIndex = computed(() => this.rows().findIndex(r => r.key === this.activeKey()));

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly internalError = signal<string | null>(null);
  readonly displayError = computed(() => this.error() ?? this.internalError());
  readonly hasError = computed(() => !!this.displayError());

  private readonly sheetMode = signal(false);
  readonly sheet = this.sheetMode.asReadonly();

  // ---- ids
  readonly id = `ts-${++uid}`;
  readonly labelId = `${this.id}-label`;
  readonly valueId = `${this.id}-value`;
  readonly treeId = `${this.id}-tree`;
  rowId(key: string) { return `${this.id}-n-${this.index().get(key)?.num ?? key}`; }
  readonly activeId = computed(() => this.activeKey() !== null && this.activeIndex() >= 0 ? this.rowId(this.activeKey()!) : null);

  // ---- exibição no campo
  /** `single`: caminho do nó escolhido */
  readonly selectedPath = computed(() => {
    const v = this.current();
    if (this.isCheckbox() || typeof v !== 'string') return null;
    return this.index().get(v)?.path.join(this.pathSeparator()) ?? null;
  });
  /** `checkbox`: rótulos das folhas marcadas, na ordem da árvore */
  readonly selectedLabels = computed(() => {
    if (!this.isCheckbox()) return [];
    const sel = this.selected();
    const out: string[] = [];
    for (const [key, info] of this.index()) if (info.isLeaf && sel.has(key)) out.push(info.node.label);
    return out;
  });
  readonly chips = computed(() => this.selectedLabels().slice(0, Math.max(0, this.maxChips())));
  readonly moreCount = computed(() => this.selectedLabels().length - this.chips().length);
  readonly isEmpty = computed(() => this.selected().size === 0);

  // ---- DOM
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly btnEl = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly treeEl = viewChild<ElementRef<HTMLElement>>('tree');
  private readonly filterInputEl = viewChild<ElementRef<HTMLInputElement>>('filterInput');

  // ---- ControlValueAccessor
  private onChange: (v: TreeSelectValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: TreeSelectValue): void { this.current.set(v ?? this.emptyValue()); }
  registerOnChange(fn: (v: TreeSelectValue) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    if (isDisabled) this.open.set(false);
  }

  private commit(v: TreeSelectValue) {
    this.current.set(v);
    this.valueChange.emit(v);
    this.onChange(v);
  }

  ngAfterViewInit(): void { this.recalcSheet(); }

  ngOnDestroy(): void { if (this.typeTimer) clearTimeout(this.typeTimer); }

  // ---- responsividade (sheet no mobile)
  @HostListener('window:resize')
  recalcSheet() {
    const mode = this.responsive();
    if (mode === 'sheet') return this.sheetMode.set(true);
    if (mode === 'menu') return this.sheetMode.set(false);
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    this.sheetMode.set(w <= this.sheetBreakpoint());
  }

  // ---- regras de cada nó
  /** `single`: pode ser escolhido? */
  isSelectable(key: string): boolean {
    const info = this.index().get(key);
    if (!info || info.disabled || info.node.selectable === false) return false;
    return !this.leafOnly() || info.isLeaf;
  }

  /** folhas que marcar este nó afeta (com filtro, só as visíveis) */
  private targetLeaves(key: string): string[] {
    const f = this.filtered();
    const info = this.index().get(key);
    if (!info) return [];
    return f ? visibleLeaves(key, f, this.index()) : info.leaves;
  }

  /** `checkbox`: pode ser marcado? (grupo sem folhas marcáveis não pode) */
  isCheckable(key: string): boolean { return this.targetLeaves(key).length > 0; }

  stateOf(key: string): CheckState {
    const info = this.index().get(key);
    return info ? checkState(info, this.selected(), this.index()) : 'unchecked';
  }

  ariaChecked(key: string): 'true' | 'false' | 'mixed' {
    const s = this.stateOf(key);
    return s === 'mixed' ? 'mixed' : s === 'checked' ? 'true' : 'false';
  }

  isRowDisabled(key: string): boolean {
    return this.isCheckbox() ? !this.isCheckable(key) : !!this.index().get(key)?.disabled;
  }

  // ---- ações
  toggleExpand(key: string, ev?: Event) {
    ev?.stopPropagation();
    if (this.filtered()) return; // com filtro tudo fica aberto
    this.expanded.update(s => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    this.activeKey.set(key);
  }

  /** clique/Enter/Espaço numa linha */
  activate(row: TreeRow<T>) {
    this.activeKey.set(row.key);
    if (this.isCheckbox()) {
      if (!this.isCheckable(row.key)) return;
      const next = toggleLeaves(this.targetLeaves(row.key), this.selected());
      // devolve só folhas, na ordem da árvore
      const ordered: string[] = [];
      for (const [key, info] of this.index()) if (info.isLeaf && next.has(key)) ordered.push(key);
      this.commit(ordered);
      return;
    }
    if (this.isSelectable(row.key)) {
      this.commit(row.key);
      this.close();
      this.focusButton();
    } else if (row.hasChildren) {
      this.toggleExpand(row.key);
    }
  }

  onRowClick(row: TreeRow<T>) {
    this.activate(row);
    if (this.open()) this.treeEl()?.nativeElement.focus();
  }

  // ---- abrir/fechar
  toggle() {
    if (this.isDisabled()) return;
    if (this.open()) this.close(); else this.openPanel();
  }

  openPanel() {
    if (this.isDisabled()) return;
    this.filter.set('');
    // single: abre os ancestrais do escolhido para ele aparecer já ativo
    const v = this.current();
    if (!this.isCheckbox() && typeof v === 'string' && this.index().has(v)) {
      this.expanded.update(s => {
        const next = new Set(s);
        for (let p = this.index().get(v)!.parent; p; p = this.index().get(p)!.parent) next.add(p);
        return next;
      });
      this.activeKey.set(v);
    } else {
      this.activeKey.set(this.rows()[0]?.key ?? null);
    }
    this.open.set(true);
    // depois que o painel (@if) for desenhado: foco no filtro ou na árvore
    afterNextRender(() => {
      (this.filterInputEl()?.nativeElement ?? this.treeEl()?.nativeElement)?.focus();
      this.scrollActiveIntoView();
    }, { injector: this.injector });
  }

  close() {
    if (!this.open()) return;
    this.open.set(false);
    this.markTouchedAndValidate();
  }

  private focusButton() { this.btnEl()?.nativeElement.focus(); }

  // ---- limpar
  canClear() {
    return this.clearable() && !this.isDisabled() && !this.isEmpty();
  }
  clear(ev?: Event) {
    ev?.stopPropagation();
    this.commit(this.emptyValue());
    this.onTouched();
    if (this.required() && this.autoValidate()) this.internalError.set(this.requiredError());
    this.focusButton();
  }

  // ---- teclado
  onButtonKeydown(e: KeyboardEvent) {
    if (this.isDisabled()) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && this.canClear()) { e.preventDefault(); this.clear(); return; }
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openPanel(); }
  }

  onFilterInput(value: string) {
    this.filter.set(value);
    this.activeKey.set(this.rows()[0]?.key ?? null);
  }

  onFilterKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); this.treeEl()?.nativeElement.focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); this.close(); this.focusButton(); }
    else if (e.key === 'Tab' && !e.shiftKey) { this.close(); }
  }

  /** padrão WAI-ARIA de árvore */
  onTreeKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); this.close(); this.focusButton(); return; }
    if (e.key === 'Tab') { this.close(); return; } // fecha e deixa o Tab seguir o fluxo da página
    const rows = this.rows();
    if (!rows.length) return;
    const i = Math.max(0, this.activeIndex());
    const row = rows[i];
    const move = (to: number) => { this.activeKey.set(rows[Math.min(rows.length - 1, Math.max(0, to))].key); this.scrollActiveIntoView(); };

    switch (e.key) {
      case 'ArrowDown': move(i + 1); break;
      case 'ArrowUp':   move(i - 1); break;
      case 'Home':      move(0); break;
      case 'End':       move(rows.length - 1); break;
      case 'ArrowRight':
        if (row.hasChildren && !row.expanded) this.toggleExpand(row.key);
        else if (row.hasChildren) move(i + 1);
        break;
      case 'ArrowLeft': {
        const parent = this.index().get(row.key)?.parent ?? null;
        if (row.hasChildren && row.expanded && !this.filtered()) this.toggleExpand(row.key);
        else if (parent) { this.activeKey.set(parent); this.scrollActiveIntoView(); }
        break;
      }
      case 'Enter':
      case ' ':
        this.activate(row);
        break;
      default:
        if (!this.typeahead(e)) return;
    }
    e.preventDefault();
  }

  // ---- typeahead: pula para a próxima linha visível que começa com o texto
  private typeBuffer = '';
  private typeTimer: ReturnType<typeof setTimeout> | null = null;

  private typeahead(e: KeyboardEvent): boolean {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return false;
    if (this.typeTimer) clearTimeout(this.typeTimer);
    this.typeTimer = setTimeout(() => { this.typeBuffer = ''; this.typeTimer = null; }, TYPEAHEAD_RESET_MS);
    this.typeBuffer += e.key;

    const buf = normalize(this.typeBuffer);
    const cycling = [...buf].every(c => c === buf[0]);
    const query = cycling ? buf[0] : buf;
    const rows = this.rows();
    const start = this.activeIndex();
    const from = cycling ? start + 1 : Math.max(start, 0);
    for (let k = 0; k < rows.length; k++) {
      const row = rows[(from + k) % rows.length];
      if (normalize(row.node.label).startsWith(query)) {
        this.activeKey.set(row.key);
        this.scrollActiveIntoView();
        break;
      }
    }
    return true;
  }

  private scrollActiveIntoView() {
    queueMicrotask(() => {
      const id = this.activeId();
      const node = id ? this.host.nativeElement.querySelector<HTMLElement>(`#${id}`) : null;
      node?.scrollIntoView?.({ block: 'nearest' });
    });
  }

  // ---- clique fora fecha
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (this.open() && !e.composedPath().includes(this.host.nativeElement)) this.close();
  }

  onControlBlur() { if (!this.open()) this.markTouchedAndValidate(); }

  private markTouchedAndValidate() {
    this.onTouched();
    if (!this.autoValidate()) return;
    this.internalError.set(this.required() && this.isEmpty() ? this.requiredError() : null);
  }
}
