import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
// os testes conferem os textos em português (o padrão dos componentes é inglês)
import { UI_LABELS_PT, provideUiLabels } from '../../labels';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SwitchComponent } from './switch.component';

@Component({
  imports: [SwitchComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-switch [(checked)]="on" [disabled]="disabled()" hint="Avisos por e-mail">Notificações</app-switch>`
})
class HostComponent {
  on = signal(false);
  disabled = signal(false);
}

describe('SwitchComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;
  const input = () => el.querySelector<HTMLInputElement>('input')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('is a native checkbox with role="switch", labelled by its content', () => {
    expect(input().type).toBe('checkbox');
    expect(input().getAttribute('role')).toBe('switch');
    expect(input().closest('label')!.textContent).toContain('Notificações');
    const hint = el.querySelector(`#${input().getAttribute('aria-describedby')}`);
    expect(hint!.textContent).toContain('Avisos por e-mail');
  });

  it('toggles on click and updates [(checked)]', async () => {
    input().click();
    await fixture.whenStable();
    expect(host.on()).toBe(true);
    expect(input().checked).toBe(true);

    el.querySelector<HTMLElement>('.sw__label')!.click();
    await fixture.whenStable();
    expect(host.on()).toBe(false);
  });

  it('disabled does not toggle', async () => {
    host.disabled.set(true);
    await fixture.whenStable();
    input().click();
    await fixture.whenStable();
    expect(host.on()).toBe(false);
  });
});

@Component({
  imports: [SwitchComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-switch [formControl]="ctrl">Modo escuro</app-switch>`
})
class ReactiveHostComponent {
  ctrl = new FormControl(true, { nonNullable: true });
}

describe('SwitchComponent with forms', () => {
  it('reads/writes the control and follows disable()', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)] });
    const fixture = TestBed.createComponent(ReactiveHostComponent);
    const input = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    await fixture.whenStable();
    expect(input().checked).toBe(true);

    input().click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe(false);

    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    expect(input().disabled).toBe(true);
  });
});
