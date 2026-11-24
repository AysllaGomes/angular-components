import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { injectUiLabels } from '../../labels';

let uid = 0;

/** campos que a moldura reconhece dentro de `.ff__control` */
type TextControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** espera sem digitar antes de anunciar o contador (não fala a cada tecla) */
export const COUNTER_ANNOUNCE_DELAY_MS = 1000;

/**
 * Campo de texto: rótulo, "requerido", dica e erro em volta de um `<input>`/`<textarea>`/
 * `<select>` **nativo** projetado:
 *
 * ```html
 * <app-form-field label="CPF ou CNPJ" required [error]="form.controls.doc | fieldError">
 *   <input appMask="cpfCnpj" formControlName="doc">
 * </app-form-field>
 * ```
 *
 * O campo continua sendo o input nativo (formulários, `appMask`, autocomplete);
 * a moldura liga o rótulo (`for`/`id`), a dica/erro (`aria-describedby`),
 * `aria-invalid` e `aria-required` nele. Também: contador de caracteres (`counter`,
 * a partir do `maxlength`), prefixo/sufixo (`[ffPrefix]`/`[ffSuffix]`) e mostrar a senha
 * (`passwordToggle`). Visual: tokens do Select (`--sel-*`).
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

  /** mostra "42/200" a partir do `maxlength` do campo */
  readonly counter = input(false, { transform: booleanAttribute });
  /**
   * A partir de quantos caracteres restantes o leitor de tela ouve "Restam N" (depois de uma
   * pausa na digitação). Padrão: os últimos 20% do limite (no mínimo 5).
   */
  readonly counterAnnounceAt = input<number | null>(null);
  /** botão de mostrar/ocultar no `<input type="password">` */
  readonly passwordToggle = input(false, { transform: booleanAttribute });
  readonly showPasswordLabelInput = input<string | undefined>(undefined, { alias: 'showPasswordLabel' });
  readonly showPasswordLabel = computed(() => this.showPasswordLabelInput() ?? this.labels().formField.showPassword);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly ngControl = contentChild(NgControl, { descendants: true });
  private readonly prefixEl = viewChild<ElementRef<HTMLElement>>('prefix');
  private readonly suffixEl = viewChild<ElementRef<HTMLElement>>('suffix');

  readonly fallbackId = `ff-${++uid}`;
  readonly hintId = `${this.fallbackId}-hint`;
  readonly errorId = `${this.fallbackId}-error`;
  readonly counterId = `${this.fallbackId}-count`;
  readonly prefixId = `${this.fallbackId}-prefix`;
  readonly suffixId = `${this.fallbackId}-suffix`;
  /** id do campo projetado (o dele, se já tiver; senão um gerado) */
  controlId = this.fallbackId;

  /** caracteres digitados e limite (`maxlength`; null sem limite) */
  readonly count = signal(0);
  readonly max = signal<number | null>(null);
  readonly showCounter = computed(() => this.counter() && this.max() !== null);
  readonly left = computed(() => (this.max() ?? 0) - this.count());
  private readonly announceAt = computed(() => {
    const max = this.max() ?? 0;
    return this.counterAnnounceAt() ?? Math.max(5, Math.ceil(max * 0.2));
  });
  readonly nearLimit = computed(() => this.showCounter() && this.left() <= this.announceAt());
  /** região viva: só perto do limite, depois de uma pausa na digitação */
  readonly announcement = signal('');

  /** o campo é de senha (o botão só aparece nele) e se ela está visível agora */
  readonly isPassword = signal(false);
  readonly revealed = signal(false);

  private control: TextControl | null = null;
  private announceTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // liga rótulo, dica/erro, contador, prefixo/sufixo e estados ao campo projetado
    afterRenderEffect(() => {
      const control = this.host.querySelector<TextControl>('.ff__control > input, .ff__control > textarea, .ff__control > select');
      if (!control) return;
      this.attach(control);
      if (!control.id) control.id = this.fallbackId;
      this.controlId = control.id;
      this.host.querySelector('.ff__label')?.setAttribute('for', control.id);

      const max = 'maxLength' in control && control.maxLength >= 0 ? control.maxLength : null;
      if (max !== this.max()) this.max.set(max);
      this.syncCount();
      const password = control instanceof HTMLInputElement && (control.type === 'password' || this.revealed());
      if (password !== this.isPassword()) this.isPassword.set(password);

      const error = this.error();
      const ids = [
        error ? this.errorId : this.hint() ? this.hintId : null,
        this.hasText(this.prefixEl()) ? this.prefixId : null,
        this.hasText(this.suffixEl()) ? this.suffixId : null,
        this.showCounter() ? this.counterId : null,
      ].filter(Boolean);
      this.toggleAttr(control, 'aria-describedby', ids.length ? ids.join(' ') : null);
      this.toggleAttr(control, 'aria-invalid', error ? 'true' : null);
      this.toggleAttr(control, 'aria-required', this.required() ? 'true' : null);
    });

    // valor trocado pelo formulário (setValue, reset, ngModel): o contador acompanha
    effect(onCleanup => {
      const sub = this.ngControl()?.valueChanges?.subscribe(() => this.syncCount());
      onCleanup(() => sub?.unsubscribe());
    });

    inject(DestroyRef).onDestroy(() => clearTimeout(this.announceTimer));
  }

  toggleReveal() {
    const control = this.control;
    if (!(control instanceof HTMLInputElement)) return;
    this.revealed.update(v => !v);
    control.type = this.revealed() ? 'text' : 'password';
  }

  /** ouve o campo uma vez (digitação e envio do formulário) */
  private attach(control: TextControl) {
    if (control === this.control) return;
    this.control = control;
    control.addEventListener('input', () => {
      this.syncCount();
      this.scheduleAnnouncement();
    });
    // a senha volta a ficar oculta ao enviar (gerenciadores de senha e quem olha a tela)
    control.closest('form')?.addEventListener('submit', () => {
      if (this.revealed()) this.toggleReveal();
    });
  }

  private syncCount() {
    const n = this.control?.value.length ?? 0;
    if (n !== this.count()) this.count.set(n);
  }

  private scheduleAnnouncement() {
    if (!this.showCounter()) return;
    clearTimeout(this.announceTimer);
    this.announceTimer = setTimeout(() => {
      this.announcement.set(this.nearLimit() ? this.labels().formField.remaining(this.left()) : '');
    }, COUNTER_ANNOUNCE_DELAY_MS);
  }

  /** prefixo/sufixo com texto ("R$", "kg") descrevem o campo; ícone sem texto, não */
  private hasText(ref: ElementRef<HTMLElement> | undefined) {
    return !!ref?.nativeElement.textContent?.trim();
  }

  private toggleAttr(el: HTMLElement, name: string, value: string | null) {
    if (value === null) el.removeAttribute(name); else el.setAttribute(name, value);
  }
}
