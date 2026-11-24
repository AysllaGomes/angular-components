import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UI_LABELS_PT, provideUiLabels } from '../../labels';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { AutosizeDirective } from './autosize.directive';
import { COUNTER_ANNOUNCE_DELAY_MS, FormFieldComponent } from './form-field.component';

@Component({
  imports: [FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-form-field id="a" label="E-mail" [required]="required()" [hint]="hint()" [error]="error()">
      <input id="email" type="email">
    </app-form-field>
    <app-form-field id="b" label="Observações" requiredLabel="(precisa)" required>
      <textarea></textarea>
    </app-form-field>
  `
})
class HostComponent {
  required = signal(true);
  hint = signal<string | null>('Usamos só para o recibo');
  error = signal<string | null>(null);
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const field = (id: string) => el.querySelector<HTMLElement>(`#${id} .ff__control > input, #${id} .ff__control > textarea`)!;
  const label = (id: string) => el.querySelector<HTMLLabelElement>(`#${id} .ff__label`)!;
  const describedText = (control: HTMLElement) => {
    const id = control.getAttribute('aria-describedby');
    return id ? el.querySelector(`#${id}`)?.textContent?.trim() : null;
  };

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

  it('keeps the id the field already has and points the label to it', () => {
    expect(field('a').id).toBe('email');
    expect(label('a').htmlFor).toBe('email');
  });

  it('gives an id to a field without one (textarea too)', () => {
    const textarea = field('b');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.id).toMatch(/^ff-\d+$/);
    expect(label('b').htmlFor).toBe(textarea.id);
    expect(textarea.getAttribute('aria-required')).toBe('true');
  });

  it('the field follows the messages: hint, then error instead, then nothing', async () => {
    const input = field('a');
    expect(describedText(input)).toBe('Usamos só para o recibo');
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    host.error.set('Informe um e-mail válido');
    await fixture.whenStable();
    expect(describedText(input)).toBe('Informe um e-mail válido');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    host.error.set(null);
    host.hint.set(null);
    host.required.set(false);
    await fixture.whenStable();
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-required')).toBe(false);
  });

  it('"required" marker: default text, or the one given per instance', () => {
    expect(el.querySelector('#a .ff__req')!.textContent!.trim()).toBe(UI_LABELS_PT.required);
    expect(el.querySelector('#b .ff__req')!.textContent!.trim()).toBe('(precisa)');
  });
});

// ===== recursos do campo de texto: contador, prefixo/sufixo, senha, textarea que cresce
@Component({
  imports: [FormFieldComponent, AutosizeDirective, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-form-field id="bio" label="Bio" hint="Conte um pouco" counter [counterAnnounceAt]="3">
      <textarea maxlength="10" [formControl]="bio" appAutosize="3"></textarea>
    </app-form-field>
    <app-form-field id="price" label="Valor">
      <span ffPrefix>R$</span>
      <input [formControl]="price">
      <svg ffSuffix width="16" height="16" aria-hidden="true"></svg>
    </app-form-field>
    <form id="login" (submit)="$event.preventDefault()">
      <app-form-field id="pwd" label="Senha" passwordToggle>
        <input type="password" [formControl]="pwd">
      </app-form-field>
      <button id="go" type="submit">Entrar</button>
    </form>
    <app-form-field id="mail" label="E-mail" passwordToggle><input type="email"></app-form-field>
  `
})
class FeaturesHostComponent {
  bio = new FormControl('');
  price = new FormControl('');
  pwd = new FormControl('');
}

describe('FormFieldComponent: counter, affixes, password, autosize', () => {
  let fixture: ComponentFixture<FeaturesHostComponent>;
  let host: FeaturesHostComponent;
  let el: HTMLElement;

  const control = <E extends HTMLElement>(id: string) =>
    el.querySelector<E>(`#${id} .ff__control > input, #${id} .ff__control > textarea`)!;
  /** o que o leitor de tela ouve como descrição: o texto de cada id, sem o que é aria-hidden */
  const described = (id: string) => (control(id).getAttribute('aria-describedby') ?? '')
    .split(' ').filter(Boolean).map(ref => {
      const copy = el.querySelector(`#${ref}`)!.cloneNode(true) as HTMLElement;
      copy.querySelectorAll('[aria-hidden="true"]').forEach(n => n.remove());
      return copy.textContent!.replace(/\s+/g, ' ').trim();
    });
  const live = (id: string) => el.querySelector(`#${id} [aria-live="polite"]`)!.textContent!.trim();
  const counterText = (id: string) => el.querySelector(`#${id} .ff__count [aria-hidden="true"]`)!.textContent;
  const type = async (id: string, value: string) => {
    const c = control<HTMLTextAreaElement>(id);
    c.value = value;
    c.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(FeaturesHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.useRealTimers());

  describe('counter', () => {
    it('shows count/max from maxlength and describes the field with the full sentence', async () => {
      expect(counterText('bio')).toBe('0/10');
      expect(described('bio')).toEqual(['Conte um pouco', '0 de 10 caracteres']);

      await type('bio', 'abcd');
      expect(counterText('bio')).toBe('4/10');
    });

    it('follows values written by the form too (setValue, reset)', async () => {
      host.bio.setValue('abcdefg');
      await fixture.whenStable();
      expect(counterText('bio')).toBe('7/10');
      host.bio.reset();
      await fixture.whenStable();
      expect(counterText('bio')).toBe('0/10');
    });

    it('announces only near the limit, after a pause in typing', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      await type('bio', 'abc'); // restam 7: longe do limite (3)
      vi.advanceTimersByTime(COUNTER_ANNOUNCE_DELAY_MS);
      await fixture.whenStable();
      expect(live('bio')).toBe('');

      await type('bio', 'abcdefgh'); // restam 2
      vi.advanceTimersByTime(COUNTER_ANNOUNCE_DELAY_MS - 1);
      await fixture.whenStable();
      expect(live('bio')).toBe(''); // ainda digitando
      vi.advanceTimersByTime(1);
      await fixture.whenStable();
      expect(live('bio')).toBe('Restam 2 caracteres');
      expect(el.querySelector('#bio .ff__count')!.classList).toContain('is-near');

      await type('bio', 'abcdefghij');
      vi.advanceTimersByTime(COUNTER_ANNOUNCE_DELAY_MS);
      await fixture.whenStable();
      expect(live('bio')).toBe('Limite de caracteres atingido');
    });

    it('no counter without maxlength', () => {
      expect(el.querySelector('#price .ff__count')).toBeNull();
    });
  });

  describe('prefix and suffix', () => {
    it('sit inside the box; text ("R$") describes the field, an icon does not', () => {
      expect(el.querySelector('#price .ff__affix--prefix')!.textContent!.trim()).toBe('R$');
      expect(el.querySelector('#price .ff__affix--suffix svg')).not.toBeNull();
      expect(described('price')).toEqual(['R$']);
    });

    it('do not touch the value', () => {
      expect(host.price.value).toBe('');
      expect(control<HTMLInputElement>('price').value).toBe('');
    });
  });

  describe('password', () => {
    const toggle = () => el.querySelector<HTMLButtonElement>('#pwd .ff__reveal')!;

    it('a named toggle button (pressed state) that switches the input type', async () => {
      expect(toggle().getAttribute('aria-label')).toBe('Mostrar senha');
      expect(toggle().getAttribute('aria-pressed')).toBe('false');
      expect(toggle().getAttribute('aria-controls')).toBe(control('pwd').id);

      toggle().click();
      await fixture.whenStable();
      expect(control<HTMLInputElement>('pwd').type).toBe('text');
      expect(toggle().getAttribute('aria-pressed')).toBe('true');
      expect(toggle().getAttribute('aria-label')).toBe('Mostrar senha'); // o nome não muda, o estado sim

      toggle().click();
      await fixture.whenStable();
      expect(control<HTMLInputElement>('pwd').type).toBe('password');
    });

    it('hides it again when the form is submitted', async () => {
      toggle().click();
      await fixture.whenStable();
      el.querySelector<HTMLFormElement>('#login')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await fixture.whenStable();
      expect(control<HTMLInputElement>('pwd').type).toBe('password');
      expect(toggle().getAttribute('aria-pressed')).toBe('false');
    });

    it('only on password fields', () => {
      expect(el.querySelector('#mail .ff__reveal')).toBeNull();
    });
  });

  describe('appAutosize', () => {
    // jsdom não faz layout: o "texto" vira uma altura de conteúdo simulada
    const fakeLayout = (ta: HTMLTextAreaElement, contentHeight: () => number) => {
      Object.defineProperty(ta, 'scrollHeight', { configurable: true, get: contentHeight });
      ta.style.lineHeight = '20px';
      ta.style.padding = '10px 0';
      ta.style.borderWidth = '0';
    };

    it('grows with the text up to the max rows, then scrolls', async () => {
      const ta = control<HTMLTextAreaElement>('bio');
      let content = 40;
      fakeLayout(ta, () => content);

      await type('bio', 'a');
      expect(ta.style.height).toBe('40px');
      expect(ta.style.overflowY).toBe('hidden');

      content = 200; // passou de 3 linhas: 3 × 20 + 20 de padding = 80
      await type('bio', 'abcdefghij');
      expect(ta.style.height).toBe('80px');
      expect(ta.style.overflowY).toBe('auto');
      expect(ta.style.resize).toBe('none');
    });

    it('follows values written by the form', async () => {
      const ta = control<HTMLTextAreaElement>('bio');
      fakeLayout(ta, () => 60);
      host.bio.setValue('abc');
      await new Promise(r => setTimeout(r));
      expect(ta.style.height).toBe('60px');
    });
  });
});

// ===== campo que aparece e some (@if) num formulário que fica: sem listeners sobrando
@Component({
  imports: [FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form id="f">
      @if (show()) {
        <app-form-field label="Senha" passwordToggle counter><input type="password" maxlength="20"></app-form-field>
      }
    </form>
  `
})
class ToggleHostComponent { show = signal(true); }

describe('FormFieldComponent: listeners are cleaned up', () => {
  it('a field that comes and goes (@if) does not pile up submit listeners on the form', async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();

    const form = HTMLFormElement.prototype;
    const live = new Set<EventListenerOrEventListenerObject>();
    const add = vi.spyOn(form, 'addEventListener').mockImplementation(function (this: HTMLFormElement, type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions) {
      if (type === 'submit') live.add(fn);
      EventTarget.prototype.addEventListener.call(this, type, fn, opts);
    });
    const remove = vi.spyOn(form, 'removeEventListener').mockImplementation(function (this: HTMLFormElement, type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | EventListenerOptions) {
      if (type === 'submit') live.delete(fn);
      EventTarget.prototype.removeEventListener.call(this, type, fn, opts);
    });

    try {
      const fixture = TestBed.createComponent(ToggleHostComponent);
      await fixture.whenStable();
      for (let i = 0; i < 4; i++) {
        fixture.componentInstance.show.set(false);
        await fixture.whenStable();
        fixture.componentInstance.show.set(true);
        await fixture.whenStable();
      }
      // um campo vivo, um listener; os dos campos destruídos foram removidos
      expect(fixture.nativeElement.querySelectorAll('app-form-field').length).toBe(1);
      expect(live.size).toBe(1);

      fixture.destroy();
      expect(live.size).toBe(0);
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });
});
