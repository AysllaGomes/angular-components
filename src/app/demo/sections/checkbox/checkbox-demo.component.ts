import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { TPipe } from '../../../site/i18n/t.pipe';

import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { CheckboxGroupComponent } from '../../../shared/components/checkbox-group/checkbox-group.component';
import { CheckboxOption } from '../../../shared/components/checkbox-group/checkbox-group.types';
import { I18nService } from '../../../site/services/i18n.service';

type Channel = 'email' | 'sms' | 'push';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [TPipe, ReactiveFormsModule, ButtonDirective, CheckboxComponent, CheckboxGroupComponent],
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

  // ---- Checkbox group
  private readonly i18n = inject(I18nService);
  readonly topics = computed<CheckboxOption<string>[]>(() => [
    { label: this.i18n.t('cbg.demo.topic.news'), value: 'news', description: this.i18n.t('cbg.demo.topic.news.desc') },
    { label: this.i18n.t('cbg.demo.topic.deals'), value: 'deals' },
    { label: this.i18n.t('cbg.demo.topic.tips'), value: 'tips' },
    { label: this.i18n.t('cbg.demo.topic.security'), value: 'security', disabled: true },
  ]);
  alerts = signal<string[]>(['news', 'security']);

  readonly days = computed<CheckboxOption<string>[]>(() =>
    ['mon', 'tue', 'wed', 'thu', 'fri'].map(d => ({ label: this.i18n.t('cbg.demo.day.' + d), value: d })));
  chosenDays = signal<string[]>(['mon', 'wed']);

  alertsCtrl = new FormControl<string[]>([], { nonNullable: true, validators: Validators.required });
  alertsStatus = toSignal(this.alertsCtrl.statusChanges, { initialValue: this.alertsCtrl.status });
  alertsSubmitted = signal(false);
  showAlertsError = computed(() => this.alertsSubmitted() && this.alertsStatus() === 'INVALID');

  submitAlerts() {
    this.alertsSubmitted.set(true);
    this.alertsCtrl.markAsTouched();
  }

  json(v: unknown) { return JSON.stringify(v); }
}
