import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOption } from '../../model/interface/select/select-option.interface';

import { SelectComponent } from './select.component';

@Component({
  imports: [SelectComponent],
  template: `
    <app-select
      label="Fruta"
      responsive="menu"
      [filterable]="true"
      [options]="options()"
      [(value)]="value" />
  `
})
class HostComponent {
  options = signal<SelectOption<string>[]>([
    { label: 'Maçã', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ]);
  value: string | null = null;
}

function optionLabels(fixture: ComponentFixture<unknown>): string[] {
  const el = fixture.nativeElement as HTMLElement;
  return Array.from(el.querySelectorAll('.option')).map(o => o.textContent!.trim());
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function openPanel() {
    el.querySelector<HTMLButtonElement>('button.control')!.click();
    await fixture.whenStable();
  }

  it('renders the options when opened', async () => {
    await openPanel();
    expect(optionLabels(fixture)).toEqual(['Maçã', 'Banana']);
  });

  it('updates the list when options change after first render', async () => {
    await openPanel();
    expect(optionLabels(fixture)).toEqual(['Maçã', 'Banana']);

    host.options.set([
      { label: 'Uva', value: 'grape' },
      { label: 'Kiwi', value: 'kiwi' },
      { label: 'Manga', value: 'mango' }
    ]);
    await fixture.whenStable();

    expect(optionLabels(fixture)).toEqual(['Uva', 'Kiwi', 'Manga']);
  });

  it('filters ignoring accents and case', async () => {
    await openPanel();
    const input = el.querySelector<HTMLInputElement>('.filter input')!;
    input.value = 'MACA';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(optionLabels(fixture)).toEqual(['Maçã']);
  });

  it('selects an option on click and emits the value', async () => {
    await openPanel();
    el.querySelectorAll<HTMLElement>('.option')[1].click();
    await fixture.whenStable();

    expect(host.value).toBe('banana');
    expect(el.querySelector('.control .value')!.textContent!.trim()).toBe('Banana');
    expect(el.querySelector('.panel')).toBeNull();
  });
});
