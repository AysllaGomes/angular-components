import { NgClass } from '@angular/common';
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

import { ModalSession } from '../../a11y/modal-session';
import { DialogSize } from '../../model/type/dialog-size.type';

let uid = 0;

type FixedSize = Exclude<DialogSize, 'auto'>;

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'opened()' }
})
export class DialogComponent implements OnDestroy {
  // API
  readonly title = input('Dialog');
  /** Tamanho do dialog. `auto` mede o conteúdo sempre que o dialog é aberto. */
  readonly size = input<DialogSize, DialogSize | null | undefined>('md', { transform: v => v ?? 'md' });
  readonly closeOnBackdrop = input(true);
  /**
   * Id (ou ids separados por espaço) do(s) elemento(s) que descrevem o dialog,
   * ligado ao `aria-describedby`. Leitores de tela leem esse texto junto com o título
   * ao abrir. Ex.: `describedBy="del-desc"` + `<p id="del-desc">…</p>` no conteúdo.
   * Vazio ou `null` não gera o atributo.
   */
  readonly describedBy = input<string | null>(null);

  // botões padrão (opcionais)
  readonly primaryLabel = input<string | null>(null);
  readonly secondaryLabel = input<string | null>(null);
  readonly primary = output<void>();
  readonly secondary = output<void>();

  /**
   * Controle de abertura (two-way `[(opened)]`). Como `model()`, só emite
   * `openedChange` quando o próprio dialog muda o estado (abrir/fechar).
   */
  readonly opened = model(false);

  /** largura medida no modo `auto` */
  private readonly measuredSize = signal<FixedSize>('md');
  readonly currentSize = computed<FixedSize>(() => {
    const s = this.size();
    return s === 'auto' ? this.measuredSize() : s;
  });

  private readonly dlgRef = viewChild<ElementRef<HTMLElement>>('dlg');
  /** só existe enquanto o dialog está aberto (@if) */
  private readonly contentRef = viewChild<ElementRef<HTMLElement>>('content');
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  /** foco devolvido, scroll travado e fundo inerte enquanto aberto */
  private readonly modal = new ModalSession(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);

  private id = `dlg-${++uid}`;

  get labelId() { return `${this.id}-label`; }

  // ===== Effects =====
  /** ao abrir: sessão modal + foco no "fechar"; ao fechar: desfaz tudo e devolve o foco */
  private _whenOpen = effect(() => {
    if (this.opened()) {
      if (this.modal.isActive) return;
      this.modal.open();
      // foco depois do paint
      queueMicrotask(() => this.closeBtn()?.nativeElement.focus());
    } else {
      this.modal.close();
    }
  });

  /** modo `auto`: observa o conteúdo enquanto ele estiver renderizado */
  private _autoSize = effect(onCleanup => {
    if (this.size() !== 'auto') return;
    const el = this.contentRef()?.nativeElement;
    if (!el) return;

    if (typeof ResizeObserver === 'undefined') {
      queueMicrotask(() => this.updateAutoSize(el));
      return;
    }
    // o callback inicial do ResizeObserver já faz a primeira medição
    const ro = new ResizeObserver(() => this.updateAutoSize(el));
    ro.observe(el);
    onCleanup(() => ro.disconnect());
  });

  ngOnDestroy(): void {
    // destruído aberto: não deixa o body travado nem a página inerte
    this.modal.close(false);
  }

  private updateAutoSize(el: HTMLElement) {
    // usa largura “desejada” do conteúdo
    const w = el.scrollWidth;
    this.measuredSize.set(
      w < 420 ? 'sm' :
        w < 720 ? 'md' :
          w < 960 ? 'lg' : 'xl'
    );
  }

  // ===== A11y / fechamento =====
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.opened()) return;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    if (e.key === 'Tab') this.trapFocus(e);
  }

  onBackdropClick(e: MouseEvent) {
    if (!this.closeOnBackdrop()) return;
    if ((e.target as HTMLElement).classList.contains('dlg-backdrop')) this.close();
  }

  openDialog() { this.opened.set(true); }
  close()      { this.opened.set(false); }

  // Focus trap simples dentro do dialog
  private trapFocus(e: KeyboardEvent) {
    const root = this.dlgRef()?.nativeElement; if (!root) return;
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
