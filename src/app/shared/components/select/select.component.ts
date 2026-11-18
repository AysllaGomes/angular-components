import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ResponsiveMode } from '../../model/type/responsive-mode.type';

import { SelectOption } from '../../model/interface/select/select-option.interface';

let uid = 0;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // integra com Reactive Forms (formControl/formControlName) e ngModel
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }
  ]
})
export class SelectComponent<T = any> implements AfterViewInit, ControlValueAccessor {
  // ---- API
  readonly label = input('');
  readonly panelTitle = input<string | null>(null); // título no header da sheet
  readonly required = input(false);
  readonly placeholder = input('');

  readonly disabled = input(false);
  /** desabilitado pelo formulário (setDisabledState) */
  private readonly formDisabled = signal(false);
  /** estado efetivo: input `disabled` ou formulário */
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  /** filtro opcional no painel */
  readonly filterable = input(false);
  readonly filterPlaceholder = input('');

  /** Mensagens / validação */
  /** Erro externo (ex.: vindo do estado do formulário); tem prioridade sobre a validação interna. */
  readonly error = input<string | null>(null);
  readonly requiredLabel = input('requerido');
  readonly requiredError = input('Campo obrigatório');
  readonly autoValidate = input(true);
  readonly hint = input<string | null>(null);

  /** Clear (×) */
  readonly clearable = input(false);
  readonly clearAriaLabel = input('Limpar seleção');

  /** Responsividade (sheet) */
  readonly responsive = input<ResponsiveMode>('auto');
  readonly sheetBreakpoint = input(560); // px
  readonly closeAriaLabel = input('Fechar');

  readonly options = input.required<SelectOption<T>[], SelectOption<T>[] | null | undefined>({
    transform: v => v ?? []
  });

  /** Valor selecionado (two-way `[(value)]`). Com formulários, use `formControl`/`ngModel`. */
  readonly value = input<T | null>(null);
  readonly valueChange = output<T | null>();

  /**
   * Valor atual: segue o input `value`, mas também pode ser alterado pelo
   * usuário ou pelo formulário (writeValue) sem emitir `valueChange`.
   */
  readonly current = linkedSignal<T | null>(() => this.value() ?? null);

  // ---- ControlValueAccessor
  private onChange: (v: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: T | null): void { this.current.set(v ?? null); }
  registerOnChange(fn: (v: T | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    if (isDisabled) this.open.set(false);
  }

  /** mudança feita pelo usuário: atualiza estado, two-way binding e formulário */
  private commit(v: T | null) {
    this.current.set(v);
    this.valueChange.emit(v);
    this.onChange(v);
  }

  private readonly panelEl = viewChild<ElementRef<HTMLDivElement>>('panel');
  private readonly btnEl = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly filterInputEl = viewChild<ElementRef<HTMLInputElement>>('filterInput');

  // ---- estado interno
  open = signal(false);
  highlighted = signal<number>(-1);
  private internalError = signal<string | null>(null);
  private sheetMode = signal<boolean>(false);

  readonly displayError = computed(() => this.error() ?? this.internalError());
  readonly hasError = computed(() => !!this.displayError());

  // filtro
  filter = signal('');
  private norm = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  /** lista filtrada {opt, i} i = índice original */
  readonly filtered = computed(() => {
    const q = this.norm(this.filter().trim());
    const all = this.options().map((opt, i) => ({ opt, i }));
    if (!q) return all;
    return all.filter(p => this.norm(String(p.opt.label)).includes(q));
  });

  id = `sel-${++uid}`;
  get listboxId() { return `${this.id}-listbox`; }
  optionId(i: number) { return `${this.id}-opt-${i}`; }

  get selectedLabel(): string | null {
    const i = this.options().findIndex(o => o.value === this.current());
    return i >= 0 ? this.options()[i].label : null;
  }

  ngAfterViewInit(): void {
    this.recalcSheet();
  }

  // ---- responsividade
  sheet() { return this.sheetMode(); }

  @HostListener('window:resize')
  recalcSheet() {
    const responsive = this.responsive();
    if (responsive === 'sheet') return this.sheetMode.set(true);
    if (responsive === 'menu')  return this.sheetMode.set(false);
    // auto
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    this.sheetMode.set(w <= this.sheetBreakpoint());
  }

  // ---- clear
  canClear(): boolean {
    return this.clearable() && !this.isDisabled() && this.current() !== null && this.current() !== undefined && this.current() !== '';
  }
  clear(ev?: Event) {
    ev?.stopPropagation();
    this.commit(null);
    this.onTouched();
    if (this.required() && this.autoValidate()) this.internalError.set(this.requiredError());
    this.btnEl()?.nativeElement.focus();
  }
  onClearKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.clear(e); }
  }

  // ---- abertura/fechamento
  toggle() {
    if (this.isDisabled()) return;
    // fechar pelo botão também marca como tocado/valida
    if (this.open()) this.close(); else this.openPanel();
  }
  openPanel() { if (!this.isDisabled()) { this.open.set(true); this.postOpen(); } }
  private postOpen() {
    if (this.open()) {
      this.filter.set('');
      this.syncHighlight();
      queueMicrotask(() => this.filterInputEl()?.nativeElement?.focus());
    }
  }
  close() { this.open.set(false); this.markTouchedAndValidate(); }

  // ---- seleção
  select(opt: SelectOption<T>, fi: number) {
    if (opt.disabled) return;
    this.commit(opt.value);
    this.highlighted.set(fi);
    this.close();
    this.btnEl()?.nativeElement.focus();
  }

  // ---- highlight/scroll
  highlight(fi: number) { this.highlighted.set(fi); this.scrollHighlightedIntoView(); }

  protected syncHighlight() {
    const list = this.filtered();
    if (!list.length) { this.highlighted.set(-1); return; }
    const selIdx = this.options().findIndex(o => o.value === this.current());
    const fi = selIdx >= 0 ? list.findIndex(p => p.i === selIdx) : 0;
    this.highlighted.set(Math.max(0, fi));
    queueMicrotask(() => this.scrollHighlightedIntoView());
  }

  private scrollHighlightedIntoView() {
    const panel = this.panelEl()?.nativeElement; if (!panel) return;
    const fi = this.highlighted(); if (fi < 0) return;
    const node = panel.querySelector<HTMLElement>(`#${this.optionId(fi)}`);
    if (!node) return;
    const { top, bottom } = node.getBoundingClientRect();
    const { top: pTop, bottom: pBottom } = panel.getBoundingClientRect();
    if (top < pTop || bottom > pBottom) node.scrollIntoView({ block: 'nearest' });
  }

  // ---- outside click fecha
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const host = (this.btnEl()?.nativeElement as HTMLElement | undefined)?.closest('app-select') as HTMLElement | null
      ?? (this.panelEl()?.nativeElement as HTMLElement | null);
    const path = e.composedPath();
    if (this.open() && host && !path.includes(host)) this.close();
  }

  // ---- keyboard
  onButtonKeydown(e: KeyboardEvent) {
    if (this.isDisabled()) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.canClear()) { e.preventDefault(); this.clear(); return; }
    }
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openPanel(); }
  }

  onPanelKeydown(e: KeyboardEvent) {
    if (e.target === this.filterInputEl()?.nativeElement) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this.highlight(0); (this.panelEl()?.nativeElement as HTMLElement)?.focus(); }
      if (e.key === 'Escape') { e.preventDefault(); this.close(); this.btnEl()?.nativeElement.focus(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); this.close(); this.btnEl()?.nativeElement.focus(); return; }
    const max = this.filtered().length - 1; if (max < 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.highlight(Math.min(max, this.highlighted() + 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); this.highlight(Math.max(0, this.highlighted() - 1)); }
    if (e.key === 'Home')      { e.preventDefault(); this.highlight(0); }
    if (e.key === 'End')       { e.preventDefault(); this.highlight(max); }
    if (e.key === 'Enter')     {
      e.preventDefault();
      const fi = this.highlighted(); if (fi < 0) return;
      const { opt } = this.filtered()[fi];
      this.select(opt, fi);
    }
  }

  // ---- blur do botão (quando sai do campo sem abrir/selecionar)
  onControlBlur() { if (!this.open()) this.markTouchedAndValidate(); }

  private markTouchedAndValidate() {
    this.onTouched();
    if (!this.autoValidate()) return;
    const empty = this.current() === null || this.current() === undefined || this.current() === '';
    this.internalError.set(this.required() && empty ? this.requiredError() : null);
  }
}
