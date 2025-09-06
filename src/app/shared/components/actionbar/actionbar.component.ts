import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild, signal, effect } from '@angular/core';

import { AbSize } from '../../model/type/ab-size.type';

let uid = 0;

@Component({
  selector: 'app-actionbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './actionbar.component.html',
  styleUrl: './actionbar.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'open()' }
})
export class ActionBarComponent implements AfterViewInit, OnDestroy {
  @Input() title = 'ActionBar';
  @Input() size: AbSize = 'auto';
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
  @ViewChild('content') content!: ElementRef<HTMLElement>;
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  private ro?: ResizeObserver;
  private winResizeFallback = false;
  private onWinResize = () => this.updateAutoSize();

  private id = `ab-${++uid}`;
  get labelId() { return `${this.id}-label`; }

  // espelha open() no two-way
  private emitOpened = effect(() => this.openedChange.emit(this.open()));
  // foco ao abrir
  private focusWhenOpen = effect(() => { if (this.open()) queueMicrotask(() => this.closeBtn?.nativeElement?.focus()); });

  async ngAfterViewInit(): Promise<void> {
    if (this.size === 'auto') {
      const el = this.content?.nativeElement;

      // 1) tenta usar o ResizeObserver nativo, se houver
      const RO: any = (globalThis as any).ResizeObserver;
      if (RO && el) {
        this.ro = new RO(() => this.updateAutoSize());
        // @ts-ignore
        this.ro.observe(el);
      } else if (typeof window !== 'undefined') {
        // 2) fallback simples: ouve o resize da janela
        this.winResizeFallback = true;
        window.addEventListener('resize', this.onWinResize, { passive: true });
      }

      // mede já na primeira renderização
      this.updateAutoSize();
    } else {
      this.currentSize.set(this.size);
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    if (this.winResizeFallback && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWinResize);
    }
  }

  private updateAutoSize() {
    const el = this.content?.nativeElement;
    if (!el) return;
    const w = el.scrollWidth; // largura requisitada pelo conteúdo
    const next = w < 420 ? 'sm' : w < 720 ? 'md' : 'lg';
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
