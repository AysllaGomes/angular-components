import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  inject,
  input
, computed } from '@angular/core';

import { injectUiLabels } from '../../labels';

let uid = 0;

/**
 * Moldura de campo de texto: rótulo, "requerido", dica e erro em volta de um
 * `<input>`/`<textarea>`/`<select>` **nativo** projetado:
 *
 * ```html
 * <app-form-field label="CPF ou CNPJ" required [error]="form.controls.doc | fieldError">
 *   <input appMask="cpfCnpj" formControlName="doc">
 * </app-form-field>
 * ```
 *
 * O campo continua sendo o input nativo (formulários, `appMask`, autocomplete);
 * a moldura liga o rótulo (`for`/`id`), a dica/erro (`aria-describedby`),
 * `aria-invalid` e `aria-required` nele. Visual: tokens do Select (`--sel-*`).
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // sem encapsulamento para estilizar o input projetado; classes com prefixo "ff"
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent {
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  readonly label = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly requiredLabelInput = input<string | undefined>(undefined, { alias: 'requiredLabel' });
  readonly requiredLabel = computed(() => this.requiredLabelInput() ?? this.labels().required);
  readonly hint = input<string | null>(null);
  /** mensagem de erro (ex.: `ctrl | fieldError`); marca `aria-invalid` no campo */
  readonly error = input<string | null>(null);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly fallbackId = `ff-${++uid}`;
  readonly hintId = `${this.fallbackId}-hint`;
  readonly errorId = `${this.fallbackId}-error`;
  /** id do campo projetado (o dele, se já tiver; senão um gerado) */
  controlId = this.fallbackId;

  constructor() {
    // liga rótulo, dica/erro e estados ao campo projetado sempre que mudarem
    afterRenderEffect(() => {
      const control = this.host.querySelector<HTMLElement>('.ff__control input, .ff__control textarea, .ff__control select');
      if (!control) return;
      if (!control.id) control.id = this.fallbackId;
      this.controlId = control.id;
      this.host.querySelector('.ff__label')?.setAttribute('for', control.id);

      const error = this.error();
      const describedBy = error ? this.errorId : this.hint() ? this.hintId : null;
      this.toggleAttr(control, 'aria-describedby', describedBy);
      this.toggleAttr(control, 'aria-invalid', error ? 'true' : null);
      this.toggleAttr(control, 'aria-required', this.required() ? 'true' : null);
    });
  }

  private toggleAttr(el: HTMLElement, name: string, value: string | null) {
    if (value === null) el.removeAttribute(name); else el.setAttribute(name, value);
  }
}
