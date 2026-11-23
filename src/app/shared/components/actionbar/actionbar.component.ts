import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';

import { injectUiLabels } from '../../labels';

import { ModalSession } from '../../a11y/modal-session';
import { AbSize } from '../../model/type/ab-size.type';
import { ButtonDirective } from '../button/button.directive';

let uid = 0;

type FixedSize = Exclude<AbSize, 'auto'>;

@Component({
  selector: 'app-actionbar',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './actionbar.component.html',
  styleUrl: './actionbar.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'opened()' }
})
export class ActionBarComponent implements OnDestroy {
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  readonly title = input('ActionBar');
  /** Tamanho do painel. `auto` mede o conteúdo sempre que o painel é aberto. */
  readonly size = input<AbSize, AbSize | null | undefined>('auto', { transform: v => v ?? 'auto' });
  readonly closeOnBackdrop = input(true);

  readonly primaryLabel = input<string | null>(null);
  readonly secondaryLabel = input<string | null>(null);
  readonly primary = output<void>();
  readonly secondary = output<void>();

  /**
   * Controle de abertura (two-way `[(opened)]`). Como `model()`, só emite
   * `openedChange` quando o próprio painel muda o estado (abrir/fechar).
   */
  readonly opened = model(false);

  /** largura medida no modo `auto` */
  private readonly measuredSize = signal<FixedSize>('md');
  readonly currentSize = computed<FixedSize>(() => {
    const s = this.size();
    return s === 'auto' ? this.measuredSize() : s;
  });

  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');
  /** só existe enquanto o painel está aberto (@if) */
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  private id = `ab-${++uid}`;
  get labelId() { return `${this.id}-label`; }

  /** foco devolvido, scroll travado e fundo inerte enquanto aberto */
  private readonly modal = new ModalSession(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);

  /** ao abrir: sessão modal + foco no "fechar"; ao fechar: desfaz tudo e devolve o foco */
  private whenOpen = effect(() => {
    if (this.opened()) {
      if (this.modal.isActive) return;
      this.modal.open();
      queueMicrotask(() => this.closeBtn()?.nativeElement.focus());
    } else {
      this.modal.close();
    }
  });

  ngOnDestroy(): void {
    // destruído aberto: não deixa o body travado nem a página inerte
    this.modal.close(false);
  }

  /** modo `auto`: observa o conteúdo enquanto ele estiver renderizado */
  private autoSize = effect(onCleanup => {
    if (this.size() !== 'auto') return;
    const el = this.content()?.nativeElement;
    if (!el) return;

    if (typeof ResizeObserver !== 'undefined') {
      // o callback inicial do ResizeObserver já faz a primeira medição
      const ro = new ResizeObserver(() => this.updateAutoSize(el));
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    } else if (typeof window !== 'undefined') {
      // fallback simples: ouve o resize da janela
      const onResize = () => this.updateAutoSize(el);
      window.addEventListener('resize', onResize, { passive: true });
      queueMicrotask(onResize);
      onCleanup(() => window.removeEventListener('resize', onResize));
    }
  });

  private updateAutoSize(el: HTMLElement) {
    const w = el.scrollWidth; // largura requisitada pelo conteúdo
    this.measuredSize.set(w < 436 ? 'sm' : w < 720 ? 'md' : 'lg');
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.opened()) return;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    if (e.key === 'Tab') this.trapFocus(e);
  }

  onBackdropClick(e: MouseEvent) {
    if (!this.closeOnBackdrop()) return;
    if ((e.target as HTMLElement).classList.contains('ab')) this.close();
  }

  openBar() { this.opened.set(true); }
  close()   { this.opened.set(false); }

  private trapFocus(e: KeyboardEvent) {
    const root = this.sheet()?.nativeElement; if (!root) return;
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
