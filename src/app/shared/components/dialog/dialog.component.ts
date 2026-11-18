import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild, effect, signal } from '@angular/core';

import { DialogSize } from '../../model/type/dialog-size.type';

let uid = 0;

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'open()' }
})
export class DialogComponent implements OnDestroy {
  // API
  @Input() title = 'Dialog';
  /** Tamanho do dialog. `auto` mede o conteúdo sempre que o dialog é aberto. */
  @Input() set size(v: DialogSize) { this._size = v ?? 'md'; this.applySize(); }
  get size(): DialogSize { return this._size; }
  private _size: DialogSize = 'md';
  @Input() closeOnBackdrop = true;

  // botões padrão (opcionais)
  @Input() primaryLabel: string | null = null;
  @Input() secondaryLabel: string | null = null;
  @Output() primary = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();

  // controle de abertura (two-way)
  @Input() set opened(v: boolean) { this.open.set(!!v); }
  @Output() openedChange = new EventEmitter<boolean>();

  // estado
  open = signal(false);
  currentSize = signal<Exclude<DialogSize, 'auto'>>('md');

  @ViewChild('dlg')      dlgRef!: ElementRef<HTMLElement>;
  /**
   * O conteúdo só existe enquanto o dialog está aberto (*ngIf), então a
   * observação de tamanho é (re)ligada sempre que o elemento aparece.
   */
  @ViewChild('content') set contentEl(ref: ElementRef<HTMLElement> | undefined) {
    this.contentRef = ref;
    this.applySize();
  }
  private contentRef?: ElementRef<HTMLElement>;
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  private ro?: ResizeObserver;
  private id = `dlg-${++uid}`;
  private prevOverflow?: string;

  get labelId() { return `${this.id}-label`; }

  // ===== Effects em injeção (seguros p/ signals) =====
  /** espelha open no @Output (two-way) */
  private _emitOpened = effect(() => this.openedChange.emit(this.open()));

  /** foco inicial + scroll-lock no body */
  private _whenOpen = effect(() => {
    const isOpen = this.open();
    // foco depois do paint
    if (isOpen) queueMicrotask(() => this.closeBtn?.nativeElement?.focus());
    // scroll-lock
    if (typeof document !== 'undefined') {
      const body = document.body;
      if (isOpen) {
        this.prevOverflow = body.style.overflow;
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = this.prevOverflow ?? '';
      }
    }
  });

  private applySize() {
    this.ro?.disconnect();
    this.ro = undefined;

    if (this._size !== 'auto') {
      this.currentSize.set(this._size);
      return;
    }

    const el = this.contentRef?.nativeElement;
    if (!el) return;
    if (typeof ResizeObserver !== 'undefined') {
      // o callback inicial do ResizeObserver já faz a primeira medição
      this.ro = new ResizeObserver(() => this.updateAutoSize());
      this.ro.observe(el);
    } else {
      queueMicrotask(() => this.updateAutoSize());
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    // garante que não deixa body travado
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.prevOverflow ?? '';
    }
  }

  private updateAutoSize() {
    const el = this.contentRef?.nativeElement;
    if (!el) return;
    // usa largura “desejada” do conteúdo
    const w = el.scrollWidth;
    const next =
      w < 420 ? 'sm' :
        w < 720 ? 'md' :
          w < 960 ? 'lg' : 'xl';
    this.currentSize.set(next as any);
  }

  // ===== A11y / fechamento =====
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.open()) return;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    if (e.key === 'Tab') this.trapFocus(e);
  }

  onBackdropClick(e: MouseEvent) {
    if (!this.closeOnBackdrop) return;
    if ((e.target as HTMLElement).classList.contains('dlg-backdrop')) this.close();
  }

  openDialog() { this.open.set(true); }
  close()      { this.open.set(false); }

  // Focus trap simples dentro do dialog
  private trapFocus(e: KeyboardEvent) {
    const root = this.dlgRef?.nativeElement; if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables).filter(n => !n.hasAttribute('disabled'));
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
