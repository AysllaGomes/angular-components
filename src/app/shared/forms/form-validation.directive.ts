import { Directive, ElementRef, Injector, afterNextRender, inject, output } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

/** elementos que recebem foco dentro de um campo (o próprio input ou o de um componente) */
const FOCUSABLE = [
  'input:not([type="hidden"]):not([disabled]):checked',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

/**
 * Centraliza o envio de um formulário reativo:
 *
 * ```html
 * <form [formGroup]="form" appFormValidation (validSubmit)="salvar($event)">
 * ```
 *
 * - inválido: marca todos os campos como tocados (as mensagens do `fieldError`
 *   aparecem de uma vez) e **leva o foco ao primeiro campo com erro**, na ordem da tela;
 * - válido: emite `validSubmit` com o valor do formulário.
 *
 * Avisos por toast ficam para erros do back-end (ex.: a resposta da requisição).
 */
@Directive({
  selector: 'form[formGroup][appFormValidation]',
  standalone: true,
  host: { '(submit)': 'onSubmit($event)' },
})
export class FormValidationDirective {
  private readonly formDir = inject(FormGroupDirective, { self: true });
  private readonly host = inject<ElementRef<HTMLFormElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  /** formulário válido enviado; payload = `form.getRawValue()` */
  readonly validSubmit = output<any>();
  /** formulário inválido enviado (o foco já foi para o primeiro erro) */
  readonly invalidSubmit = output<void>();

  onSubmit(ev: Event) {
    ev.preventDefault();
    const form = this.formDir.form;
    form.markAllAsTouched();
    if (form.valid) {
      this.validSubmit.emit(form.getRawValue());
      return;
    }
    this.invalidSubmit.emit();
    // depois da renderização: as classes .ng-invalid e as mensagens já estão atualizadas
    afterNextRender(() => this.focusFirstInvalid(), { injector: this.injector });
  }

  /** primeiro controle inválido na ordem do DOM (Angular marca cada um com `.ng-invalid`) */
  focusFirstInvalid(): boolean {
    const field = Array.from(this.host.querySelectorAll<HTMLElement>('.ng-invalid'))
      .find(el => !el.matches('form, [formgroupname], [formarrayname], [ngmodelgroup]'));
    if (!field) return false;
    const target = field.matches(FOCUSABLE.join(','))
      ? field
      : FOCUSABLE.map(sel => field.querySelector<HTMLElement>(sel)).find(Boolean) ?? null;
    if (!target) return false;
    target.focus({ preventScroll: true });
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView?.({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    return true;
  }
}
