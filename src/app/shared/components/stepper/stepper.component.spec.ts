import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperComponent } from './stepper.component';

@Component({
  imports: [StepperComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-stepper ariaLabel="Pedido" doneLabel="feita" [steps]="steps" [current]="current()"
               (stepChange)="current.set($event)" />`
})
class HostComponent {
  steps = [{ label: 'Entrega' }, { label: 'Pagamento' }, { label: 'Resumo' }, { label: 'Fim' }];
  current = signal(1);
}

describe('StepperComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let el: HTMLElement;
  const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.stepper-button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('is a named navigation with an ordered list (not tabs)', () => {
    const nav = el.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Pedido');
    expect(nav.querySelector('ol')).not.toBeNull();
    expect(el.querySelector('[role="tab"], [role="tablist"]')).toBeNull();
  });

  it('marks the current step with aria-current="step" and done steps with hidden text', () => {
    expect(buttons().map(b => b.getAttribute('aria-current'))).toEqual([null, 'step', null, null]);
    expect(buttons()[0].querySelector('.sr-only')?.textContent).toContain('feita');
    expect(buttons()[1].querySelector('.sr-only')).toBeNull();
  });

  it('only allows going back or to the next step', async () => {
    expect(buttons().map(b => b.disabled)).toEqual([false, false, false, true]);
    buttons()[2].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.current()).toBe(2);
    expect(buttons()[2].getAttribute('aria-current')).toBe('step');
  });
});
