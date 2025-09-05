import { NgIf, NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  signal,
  computed
} from '@angular/core';

import { SelectOption } from '../../model/interface/select/select-option.interface';

let uid = 0;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './select.component.html',
  styleUrl: './select.component.sass'
})
export class SelectComponent<T = any> {
  // ---- API
  @Input() label = '';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() disabled = false;

  /** filtro opcional no painel */
  @Input() filterable = false;
  @Input() filterPlaceholder = '';

  /** Mensagens / validação */
  @Input() error: string | null = null;
  @Input() requiredLabel = 'requerido';
  @Input() requiredError = 'Campo obrigatório';
  @Input() autoValidate = true;
  @Input() hint: string | null = null;

  @Input({ required: true }) options: SelectOption<T>[] = [];
  @Input() value: T | null = null;
  @Output() valueChange = new EventEmitter<T>();

  @ViewChild('panel')  panelEl?: ElementRef<HTMLDivElement>;
  @ViewChild('button') btnEl?:   ElementRef<HTMLButtonElement>;
  @ViewChild('filterInput') filterInputEl?: ElementRef<HTMLInputElement>;

  // ---- estado interno
  open = signal(false);
  highlighted = signal<number>(-1);
  private internalError = signal<string | null>(null);

  readonly displayError = computed(() => this.error ?? this.internalError());
  readonly hasError = computed(() => !!this.displayError());

  // filtro
  filter = signal('');
  private norm = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  /** lista filtrada {opt, fi} fi = índice filtrado */
  readonly filtered = computed(() => {
    const q = this.norm(this.filter().trim());
    const all = this.options.map((opt, i) => ({ opt, i }));
    if (!q) return all;
    return all.filter(p => this.norm(String(p.opt.label)).includes(q));
  });

  id = `sel-${++uid}`;
  get listboxId() { return `${this.id}-listbox`; }
  optionId(i: number) { return `${this.id}-opt-${i}`; }

  get selectedLabel(): string | null {
    const i = this.options.findIndex(o => o.value === this.value);
    return i >= 0 ? this.options[i].label : null;
  }

  // ---- abertura/fechamento
  toggle() { if (!this.disabled) this.open.update(v => !v); this.postOpen(); }
  openPanel() { if (!this.disabled) { this.open.set(true); this.postOpen(); } }
  private postOpen() {
    if (this.open()) {
      // zera filtro ao abrir
      this.filter.set('');
      this.syncHighlight();
      // foca o input de filtro se existir
      queueMicrotask(() => this.filterInputEl?.nativeElement?.focus());
    }
  }
  close() { this.open.set(false); this.markTouchedAndValidate(); }

  // ---- seleção
  select(opt: SelectOption<T>, fi: number) {
    if (opt.disabled) return;
    this.value = opt.value;
    this.valueChange.emit(opt.value);
    this.highlighted.set(fi);
    this.close();
    this.btnEl?.nativeElement.focus();
  }

  // ---- highlight/scroll
  highlight(fi: number) { this.highlighted.set(fi); this.scrollHighlightedIntoView(); }

  protected syncHighlight() {
    const list = this.filtered();
    if (!list.length) { this.highlighted.set(-1); return; }
    const selIdx = this.options.findIndex(o => o.value === this.value);
    const fi = selIdx >= 0 ? list.findIndex(p => p.i === selIdx) : 0;
    this.highlighted.set(Math.max(0, fi));
    queueMicrotask(() => this.scrollHighlightedIntoView());
  }

  private scrollHighlightedIntoView() {
    const panel = this.panelEl?.nativeElement; if (!panel) return;
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
    const host = (this.btnEl?.nativeElement as HTMLElement | undefined)?.closest('app-select') as HTMLElement | null
      ?? (this.panelEl?.nativeElement as HTMLElement | null);
    const path = e.composedPath();
    if (this.open() && host && !path.includes(host)) this.close();
  }

  // ---- keyboard
  onButtonKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openPanel(); }
  }

  onPanelKeydown(e: KeyboardEvent) {
    // se o alvo for o input de filtro, só intercepta arrows p/ ir à lista
    if (e.target === this.filterInputEl?.nativeElement) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this.highlight(0); (this.panelEl?.nativeElement as HTMLElement)?.focus(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); this.close(); this.btnEl?.nativeElement.focus(); return; }
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
    if (!this.autoValidate) return;
    const empty = this.value === null || this.value === undefined || this.value === '';
    this.internalError.set(this.required && empty ? this.requiredError : null);
  }
}
