import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, viewChild } from '@angular/core';

import { injectUiLabels } from '../../labels';

import { ToastService } from './toast.service';

import { ButtonDirective } from '../button/button.directive';

import { Toast } from './toast.types';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.sass',
  standalone: true,
  imports: [
    ButtonDirective
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // um Dialog aberto deixa o resto da página inerte; os toasts continuam ativos
  host: { 'data-dialog-keep-active': '' }
})
export class ToastContainerComponent {
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  readonly toast = inject(ToastService);

  /**
   * O que o leitor de tela anuncia: regiões vivas que existem desde o primeiro render
   * (uma região criada junto com o texto costuma não ser anunciada). Erros vão na
   * assertiva (`role="alert"`), o resto na educada; cada toast é anunciado uma vez.
   */
  readonly politeToasts = computed(() => this.toast.toasts().filter(t => t.kind !== 'error').reverse());
  readonly alertToasts = computed(() => this.toast.toasts().filter(t => t.kind === 'error').reverse());

  private readonly stack = viewChild<ElementRef<HTMLElement>>('stack');
  private hovered = false;
  private focused = false;

  constructor() {
    // pilha vazia: nada a pausar (o mouse/foco estavam num toast que saiu)
    effect(() => {
      if (this.toast.toasts().length === 0) this.setPause({ hovered: false, focused: false });
    });
  }

  // ===== pausa enquanto a pessoa lê ou usa (WCAG 2.2.1)
  onPointer(over: boolean) { this.setPause({ hovered: over }); }
  onFocusIn() { this.setPause({ focused: true }); }
  onFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (!next || !this.stack()?.nativeElement.contains(next)) this.setPause({ focused: false });
  }

  onAction(t: Toast) {
    t.onAction?.();
    this.remove(t);
  }

  onClose(t: Toast) {
    this.remove(t);
  }

  /** o toast clicado sai da tela: o mouse e o foco que estavam nele também */
  private remove(t: Toast) {
    this.toast.dismiss(t.id);
    this.setPause({ hovered: false, focused: false });
  }

  private setPause(s: { hovered?: boolean; focused?: boolean }) {
    this.hovered = s.hovered ?? this.hovered;
    this.focused = s.focused ?? this.focused;
    if (this.hovered || this.focused) this.toast.pause();
    else this.toast.resume();
  }
}
