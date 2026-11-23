import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  output
, computed } from '@angular/core';

import { injectUiLabels } from '../../labels';

import { ButtonDirective } from '../button/button.directive';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.sass',
  imports: [ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  /** total de itens */
  readonly total = input.required<number>();
  /** itens por página */
  readonly pageSize = input(10);
  /** índice da página (0-based) */
  readonly pageIndex = input(0);
  /** máx. de botões numéricos visíveis */
  readonly maxVisible = input(5);
  /**
   * Modo compacto: troca os números por "Página X de Y" entre as setas.
   * `true` sempre; `'auto'` só em telas estreitas (≤ 420px, via CSS); `false` (padrão) nunca.
   * Também aceita o atributo vazio: `<app-pagination compact>`.
   */
  readonly compact = input<boolean | 'auto', boolean | 'auto' | ''>(false, {
    transform: v => v === '' ? true : v
  });
  /** nome da navegação (padrão: "Paginação"); use nomes diferentes se houver mais de uma na página */
  readonly ariaLabel = input<string | null>(null);
  /** mostra os botões « Primeira / Última » nas pontas */
  readonly showFirstLast = input(false, { transform: booleanAttribute });

  /** emite o novo índice (0-based) */
  readonly pageChange = output<number>();

  /** inteiro positivo, ou o fallback para valores inválidos (0, negativo, NaN) */
  private static positiveInt(v: number, fallback: number): number {
    const n = Math.floor(Number(v));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  get pageCount(): number {
    const total = Math.max(0, Number(this.total()) || 0);
    const size = PaginationComponent.positiveInt(this.pageSize(), 1);
    return Math.max(1, Math.ceil(total / size));
  }

  /** `pageIndex` limitado ao intervalo válido [0, pageCount - 1] */
  get current(): number {
    const i = Math.floor(Number(this.pageIndex()) || 0);
    return Math.min(Math.max(0, i), this.pageCount - 1);
  }

  get canPrev() { return this.current > 0; }
  get canNext() { return this.current < this.pageCount - 1; }

  pages(): number[] {
    const count = this.pageCount;
    const visible = PaginationComponent.positiveInt(this.maxVisible(), 1);
    if (count <= visible) return Array.from({ length: count }, (_, i) => i);

    const half = Math.floor((visible - 1) / 2);
    let start = Math.max(0, this.current - half);
    let end = start + visible;

    if (end > count) {
      end = count;
      start = Math.max(0, end - visible);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  goTo(i: number) {
    if (i === this.current || i < 0 || i >= this.pageCount) return;
    this.pageChange.emit(i);
  }
  prev() { if (this.canPrev) this.pageChange.emit(this.current - 1); }
  next() { if (this.canNext) this.pageChange.emit(this.current + 1); }
  first() { this.goTo(0); }
  last()  { this.goTo(this.pageCount - 1); }

  // ---- teclado: ←/→ página anterior/próxima, Home/End primeira/última
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  onKeydown(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const targets: Record<string, number> = {
      ArrowLeft: this.current - 1,
      ArrowRight: this.current + 1,
      Home: 0,
      End: this.pageCount - 1,
    };
    if (!(e.key in targets)) return;
    e.preventDefault();
    const target = targets[e.key];
    if (target === this.current || target < 0 || target >= this.pageCount) return; // já está na ponta
    this.pageChange.emit(target);
    this.keepFocusAfterChange(target > this.current);
  }

  /**
   * Depois que o pai aplicar a nova página e a view renderizar, garante que o foco
   * não se perdeu: o botão focado pode ter saído da janela de números ou ficado
   * desabilitado (ex.: "‹" na primeira página). Vai para a página atual; no modo
   * compacto (números ocultos), para a seta habilitada mais próxima: indo para a
   * frente, a última habilitada ("‹" quando "›"/"»" desabilitam); indo para trás, a primeira.
   */
  private keepFocusAfterChange(forward: boolean) {
    afterNextRender(() => {
      const root = this.host.nativeElement;
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || !root.contains(active) || (active as HTMLButtonElement).disabled
        || active.classList.contains('pg-btn');
      if (!lost) return;
      const isVisible = (el: HTMLElement | null) => !!el && el.getClientRects().length > 0;
      const current = root.querySelector<HTMLElement>('.pg-btn[aria-current="page"]');
      const arrows = Array.from(root.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
        .filter(b => isVisible(b) && !b.classList.contains('pg-btn'));
      const fallback = forward ? arrows[arrows.length - 1] : arrows[0];
      (isVisible(current) ? current : fallback ?? current)?.focus();
    }, { injector: this.injector });
  }
}
