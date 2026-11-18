import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild, signal, effect } from '@angular/core';

import { AbSize } from '../../model/type/ab-size.type';
import {ButtonDirective} from '../button/button.directive';

let uid = 0;

@Component({
  selector: 'app-actionbar',
  standalone: true,
  imports: [NgIf, ButtonDirective],
  templateUrl: './actionbar.component.html',
  styleUrl: './actionbar.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'open()' }
})
export class ActionBarComponent implements OnDestroy {
  @Input() title = 'ActionBar';
  /** Tamanho do painel. `auto` mede o conteúdo sempre que o painel é aberto. */
  @Input() set size(v: AbSize) { this._size = v ?? 'auto'; this.applySize(); }
  get size(): AbSize { return this._size; }
  private _size: AbSize = 'auto';
  @Input() closeOnBackdrop = true;

  @Input() primaryLabel: string | null = null;
  @Input() secondaryLabel: string | null = null;
  @Output() primary = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();

  @Input() set opened(v: boolean) { this.open.set(!!v); }
  @Output() openedChange = new EventEmitter<boolean>();

  open = signal(false);
  currentSize = signal<Exclude<AbSize, 'auto'>>('md');

  @ViewChild('sheet') sheet!: ElementRef<HTMLElement>;
  /**
   * O conteúdo só existe enquanto o painel está aberto (*ngIf), então a
   * observação de tamanho é (re)ligada sempre que o elemento aparece.
   */
  @ViewChild('content') set contentEl(ref: ElementRef<HTMLElement> | undefined) {
    this.content = ref;
    this.applySize();
  }
  private content?: ElementRef<HTMLElement>;
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  private ro?: ResizeObserver;
  private winResizeFallback = false;
  private onWinResize = () => this.updateAutoSize();

  private id = `ab-${++uid}`;
  get labelId() { return `${this.id}-label`; }

  // espelha open() no two-way, apenas quando o valor muda
  private emittedOpen?: boolean;
  private emitOpened = effect(() => {
    const v = this.open();
    if (this.emittedOpen === undefined) { this.emittedOpen = v; return; }
    if (v === this.emittedOpen) return;
    this.emittedOpen = v;
    this.openedChange.emit(v);
  });
  // foco ao abrir
  private focusWhenOpen = effect(() => { if (this.open()) queueMicrotask(() => this.closeBtn?.nativeElement?.focus()); });

  private applySize() {
    this.stopObserving();

    if (this._size !== 'auto') {
      this.currentSize.set(this._size);
      return;
    }

    const el = this.content?.nativeElement;
    if (!el) return;

    if (typeof ResizeObserver !== 'undefined') {
      // o callback inicial do ResizeObserver já faz a primeira medição
      this.ro = new ResizeObserver(() => this.updateAutoSize());
      this.ro.observe(el);
    } else if (typeof window !== 'undefined') {
      // fallback simples: ouve o resize da janela
      this.winResizeFallback = true;
      window.addEventListener('resize', this.onWinResize, { passive: true });
      queueMicrotask(() => this.updateAutoSize());
    }
  }

  private stopObserving() {
    this.ro?.disconnect();
    this.ro = undefined;
    if (this.winResizeFallback && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWinResize);
      this.winResizeFallback = false;
    }
  }

  ngOnDestroy(): void {
    this.stopObserving();
  }

  private updateAutoSize() {
    const el = this.content?.nativeElement;
    if (!el) return;
    const w = el.scrollWidth; // largura requisitada pelo conteúdo
    const next = w < 436 ? 'sm' : w < 720 ? 'md' : 'lg';
    this.currentSize.set(next as any);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.open()) return;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    if (e.key === 'Tab') this.trapFocus(e);
  }

  onBackdropClick(e: MouseEvent) {
    if (!this.closeOnBackdrop) return;
    if ((e.target as HTMLElement).classList.contains('ab')) this.close();
  }

  openBar() { this.open.set(true); }
  close()   { this.open.set(false); }

  private trapFocus(e: KeyboardEvent) {
    const root = this.sheet?.nativeElement; if (!root) return;
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
