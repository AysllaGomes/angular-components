import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectOption } from '../../model/interface/select/select-option.interface';

import { SelectComponent, TYPEAHEAD_RESET_MS } from './select.component';

@Component({
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-select
      label="Fruta"
      responsive="menu"
      [filterable]="true"
      [required]="required()"
      [options]="options()"
      [(value)]="value" />
  `
})
class HostComponent {
  required = signal(false);
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

  it('closing the panel with the button validates required fields', async () => {
    const select = fixture.debugElement.children[0].componentInstance as SelectComponent;
    host.required.set(true);
    await fixture.whenStable();

    await openPanel();
    await openPanel(); // segundo clique fecha

    expect(el.querySelector('.panel')).toBeNull();
    expect(select.displayError()).toBe('Campo obrigatório');
  });
});

// ===== Formulários (ControlValueAccessor) =====

const FRUITS: SelectOption<string>[] = [
  { label: 'Maçã', value: 'apple' },
  { label: 'Banana', value: 'banana' }
];

@Component({
  imports: [SelectComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <app-select label="Fruta" responsive="menu" [options]="options" formControlName="fruit"
                  [error]="form.controls.fruit.touched && form.controls.fruit.invalid ? 'Escolha uma fruta' : null" />
    </form>
  `
})
class ReactiveHostComponent {
  options = FRUITS;
  form = new FormGroup({ fruit: new FormControl<string | null>('banana', Validators.required) });
}

@Component({
  imports: [SelectComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-select label="Fruta" responsive="menu" [options]="options" [(ngModel)]="fruit" />`
})
class NgModelHostComponent {
  options = FRUITS;
  fruit: string | null = 'apple';
}

describe('SelectComponent with forms', () => {
  const label = (el: HTMLElement) => el.querySelector('.control .value')!.textContent!.trim();
  const button = (el: HTMLElement) => el.querySelector<HTMLButtonElement>('button.control')!;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  describe('reactive forms', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;
    let host: ReactiveHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ReactiveHostComponent);
      host = fixture.componentInstance;
      el = fixture.nativeElement;
      await fixture.whenStable();
    });

    it('shows the initial control value', () => {
      expect(label(el)).toBe('Banana');
    });

    it('reflects setValue() from the form', async () => {
      host.form.controls.fruit.setValue('apple');
      await fixture.whenStable();
      expect(label(el)).toBe('Maçã');
    });

    it('updates the control when the user picks an option', async () => {
      button(el).click();
      await fixture.whenStable();
      el.querySelectorAll<HTMLElement>('.option')[0].click();
      await fixture.whenStable();

      expect(host.form.value.fruit).toBe('apple');
      expect(host.form.controls.fruit.dirty).toBe(true);
    });

    it('marks the control as touched on blur', async () => {
      button(el).dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      expect(host.form.controls.fruit.touched).toBe(true);
    });

    it('follows disable()/enable() from the form', async () => {
      host.form.controls.fruit.disable();
      await fixture.whenStable();
      expect(button(el).disabled).toBe(true);

      host.form.controls.fruit.enable();
      await fixture.whenStable();
      expect(button(el).disabled).toBe(false);
    });

    it('shows the error passed from the form state', async () => {
      host.form.controls.fruit.setValue(null);
      host.form.controls.fruit.markAsTouched();
      await fixture.whenStable();

      expect(el.textContent).toContain('Escolha uma fruta');
    });
  });

  describe('ngModel', () => {
    let fixture: ComponentFixture<NgModelHostComponent>;
    let host: NgModelHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(NgModelHostComponent);
      host = fixture.componentInstance;
      el = fixture.nativeElement;
      await fixture.whenStable();
    });

    it('shows the bound value and writes the selection back', async () => {
      expect(label(el)).toBe('Maçã');

      button(el).click();
      await fixture.whenStable();
      el.querySelectorAll<HTMLElement>('.option')[1].click();
      await fixture.whenStable();

      expect(host.fruit).toBe('banana');
    });
  });
});

// ===== Typeahead e grupos =====

const ITEMS: SelectOption<string>[] = [
  { label: 'Banana',  value: 'banana',  group: 'Frutas' },
  { label: 'Brócolis', value: 'broccoli', group: 'Legumes' },
  { label: 'Abacaxi', value: 'pineapple', group: 'Frutas' },
  { label: 'Batata',  value: 'potato',  group: 'Legumes' },
  { label: 'Bolo',    value: 'cake',    disabled: true },
  { label: 'Cenoura', value: 'carrot',  group: 'Legumes' }
];

@Component({
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-select label="Item" responsive="menu" [filterable]="filterable()"
                [options]="options" [(value)]="value" />
  `
})
class TypeaheadHostComponent {
  options = ITEMS;
  filterable = signal(false);
  value: string | null = null;
}

describe('SelectComponent typeahead and groups', () => {
  let fixture: ComponentFixture<TypeaheadHostComponent>;
  let host: TypeaheadHostComponent;
  let el: HTMLElement;

  const button = () => el.querySelector<HTMLButtonElement>('button.control')!;
  const panel = () => el.querySelector<HTMLElement>('.panel');
  const activeLabel = () => el.querySelector('.option.is-active')?.textContent?.trim();

  async function type(target: HTMLElement, keys: string) {
    for (const key of keys) {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    }
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await TestBed.configureTestingModule({
      imports: [TypeaheadHostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypeaheadHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.useRealTimers());

  it('groups options under their titles, keeping first-appearance order', async () => {
    button().click();
    await fixture.whenStable();

    const groups = Array.from(el.querySelectorAll<HTMLElement>('.group'));
    expect(groups.map(g => g.querySelector('.group-label')!.textContent!.trim())).toEqual(['Frutas', 'Legumes']);
    expect(Array.from(groups[0].querySelectorAll('.option')).map(o => o.textContent!.trim())).toEqual(['Banana', 'Abacaxi']);
    expect(Array.from(groups[1].querySelectorAll('.option')).map(o => o.textContent!.trim())).toEqual(['Brócolis', 'Batata', 'Cenoura']);

    // acessibilidade: o grupo é rotulado pelo seu título
    const labelId = groups[0].getAttribute('aria-labelledby')!;
    expect(groups[0].getAttribute('role')).toBe('group');
    expect(el.querySelector(`#${labelId}`)!.textContent!.trim()).toBe('Frutas');

    // sem grupo: fica fora de qualquer .group, e desabilitada é anunciada
    const cake = Array.from(el.querySelectorAll<HTMLElement>('.option')).find(o => o.textContent!.trim() === 'Bolo')!;
    expect(cake.closest('.group')).toBeNull();
    expect(cake.getAttribute('aria-disabled')).toBe('true');
  });

  it('keyboard navigation follows the grouped (visual) order', async () => {
    button().click();
    await fixture.whenStable();

    panel()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(activeLabel()).toBe('Abacaxi');
  });

  it('closed: typing a letter selects the first matching option without opening', async () => {
    await type(button(), 'c');
    expect(host.value).toBe('carrot');
    expect(panel()).toBeNull();
  });

  it('closed: repeating the same letter cycles through matches, skipping disabled ones', async () => {
    // ordem visual: Banana, Abacaxi | Brócolis, Batata, Cenoura | Bolo (desabilitado)
    // fechado segue a mesma ordem visual: Banana → Brócolis → Batata (Bolo é pulado)
    await type(button(), 'b');
    expect(host.value).toBe('banana');
    await type(button(), 'b');
    expect(host.value).toBe('broccoli');
    await type(button(), 'b');
    expect(host.value).toBe('potato');
    await type(button(), 'b');
    expect(host.value).toBe('banana'); // volta ao início
  });

  it('closed: a longer prefix matches ignoring accents, and the buffer resets after a pause', async () => {
    await type(button(), 'bro');
    expect(host.value).toBe('broccoli');

    vi.advanceTimersByTime(TYPEAHEAD_RESET_MS + 1);
    await type(button(), 'ab');
    expect(host.value).toBe('pineapple');
  });

  it('open: typing moves the highlight only; Enter confirms', async () => {
    button().click();
    await fixture.whenStable();

    await type(panel()!, 'ce');
    expect(activeLabel()).toBe('Cenoura');
    expect(host.value).toBeNull();

    panel()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(host.value).toBe('carrot');
  });

  it('ignores keys with modifiers and lets Space open the panel', async () => {
    button().dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }));
    await fixture.whenStable();
    expect(host.value).toBeNull();

    await type(button(), ' ');
    expect(panel()).not.toBeNull();
  });

  it('with a filter, typing goes to the filter input (no typeahead)', async () => {
    host.filterable.set(true);
    await fixture.whenStable();
    button().click();
    await fixture.whenStable();

    const input = el.querySelector<HTMLInputElement>('.filter input')!;
    await type(input, 'c');
    expect(host.value).toBeNull();
    // a tecla não moveu o destaque (continua na primeira) nem selecionou nada
    expect(activeLabel()).toBe('Banana');
  });
});
