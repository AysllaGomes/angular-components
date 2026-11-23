import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { TPipe } from '../../../site/i18n/t.pipe';

import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';

type Channel = 'email' | 'sms' | 'push';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [TPipe, ReactiveFormsModule, ButtonDirective, CheckboxComponent],
  templateUrl: './checkbox-demo.component.html',
  styleUrl: './checkbox-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CheckboxDemoComponent {
  // básico
  news = signal(false);

  // selecionar todos: o estado do "pai" é derivado dos filhos
  readonly channels: Channel[] = ['email', 'sms', 'push'];
  selected = signal<Record<Channel, boolean>>({ email: true, sms: false, push: false });
  private readonly count = computed(() => this.channels.filter(c => this.selected()[c]).length);
  allChecked = computed(() => this.count() === this.channels.length);
  someChecked = computed(() => this.count() > 0 && !this.allChecked());

  setChannel(c: Channel, value: boolean) {
    this.selected.update(s => ({ ...s, [c]: value }));
  }
  /** clicar no "pai": parcial ou vazio → marca todos; todos → desmarca todos */
  setAll(value: boolean) {
    const v = this.someChecked() ? true : value;
    this.selected.set({ email: v, sms: v, push: v });
  }

  // formulário com aceite obrigatório
  terms = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });
  termsStatus = toSignal(this.terms.statusChanges, { initialValue: this.terms.status });
  submitted = signal(false);
  showTermsError = computed(() => this.submitted() && this.termsStatus() === 'INVALID');

  submit() {
    this.submitted.set(true);
    this.terms.markAsTouched();
  }
}
