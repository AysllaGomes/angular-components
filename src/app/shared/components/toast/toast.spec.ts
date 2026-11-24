import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UI_LABELS_PT, provideUiLabels } from '../../labels';

import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from './toast.service';

// só o que o serviço usa: os specs dividem o mesmo ambiente (isolate: false)
const fakeTimers = () => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });

describe('ToastService', () => {
  let toast: ToastService;

  beforeEach(() => {
    fakeTimers();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    toast.clear();
    vi.useRealTimers();
  });

  const messages = () => toast.toasts().map(t => t.message);

  it('closes by itself after the duration (4 s by default), newest first', () => {
    toast.success('um');
    vi.advanceTimersByTime(1000);
    toast.info('dois', { duration: 1000 });
    expect(messages()).toEqual(['dois', 'um']);

    vi.advanceTimersByTime(1000);
    expect(messages()).toEqual(['um']);
    vi.advanceTimersByTime(2000);
    expect(messages()).toEqual([]);
  });

  it('a toast with an action stays until someone acts or closes it, unless a duration is given', () => {
    toast.info('Arquivo pronto', { actionLabel: 'Baixar' });
    toast.info('Desfeito', { actionLabel: 'Refazer', duration: 2000 });
    vi.advanceTimersByTime(60_000);
    expect(messages()).toEqual(['Arquivo pronto']);
    expect(toast.toasts()[0].duration).toBe(0);
  });

  it('pause keeps the remaining time; resume continues from it', () => {
    toast.success('salvo'); // 4000 ms
    vi.advanceTimersByTime(3000);
    toast.pause();
    vi.advanceTimersByTime(60_000);
    expect(messages()).toEqual(['salvo']);

    toast.resume();
    vi.advanceTimersByTime(999);
    expect(messages()).toEqual(['salvo']);
    vi.advanceTimersByTime(1);
    expect(messages()).toEqual([]);
  });

  it('a toast shown during a pause waits for the resume', () => {
    toast.pause();
    toast.success('novo', { duration: 500 });
    vi.advanceTimersByTime(10_000);
    expect(messages()).toEqual(['novo']);
    toast.resume();
    vi.advanceTimersByTime(500);
    expect(messages()).toEqual([]);
  });

  it('keeps at most 5 toasts and leaves no timer behind for the ones that drop out', () => {
    for (let i = 1; i <= 7; i++) toast.info(`t${i}`);
    expect(messages()).toEqual(['t7', 't6', 't5', 't4', 't3']);
    expect(vi.getTimerCount()).toBe(5);
  });

  it('the stack is read-only from outside', () => {
    expect('set' in toast.toasts).toBe(false);
  });
});

describe('ToastContainerComponent', () => {
  let fixture: ComponentFixture<ToastContainerComponent>;
  let el: HTMLElement;
  let toast: ToastService;

  beforeEach(async () => {
    fakeTimers();
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(ToastContainerComponent);
    el = fixture.nativeElement;
    toast = TestBed.inject(ToastService);
    document.body.appendChild(el); // foco de verdade (focusin/focusout)
    await fixture.whenStable();
  });

  afterEach(() => {
    toast.clear();
    fixture.destroy();
    el.remove();
    vi.useRealTimers();
  });

  const render = () => fixture.whenStable();
  const shown = () => Array.from(el.querySelectorAll('.toast .msg')).map(m => m.textContent!.trim());
  const region = (role: string) =>
    Array.from(el.querySelectorAll(`[role="${role}"] p`)).map(p => p.textContent!.trim());

  it('live regions exist before any toast, so the first one is announced', () => {
    expect(el.querySelector('[role="status"]')).not.toBeNull();
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('errors go to the assertive region, the rest to the polite one, each announced once', async () => {
    toast.success('Salvo');
    toast.error('Falha ao enviar');
    toast.info('Sincronizado');
    await render();

    expect(region('status')).toEqual(['Salvo', 'Sincronizado']);
    expect(region('alert')).toEqual(['Falha ao enviar']);
    // a pilha visual não é uma região viva (nem "nav"): nada é lido em dobro
    const stack = el.querySelector('.toast-stack')!;
    expect(stack.tagName).toBe('SECTION');
    expect(stack.hasAttribute('aria-live')).toBe(false);
    expect(el.querySelectorAll('.toast-stack [role]').length).toBe(0);
  });

  it('the stack is a named region only while it has toasts', async () => {
    const stack = () => el.querySelector('.toast-stack')!;
    expect(stack().hasAttribute('aria-label')).toBe(false);
    toast.info('Oi');
    await render();
    expect(stack().getAttribute('aria-label')).toBe('Notificações');
  });

  it('hovering a toast pauses every timer; leaving resumes them', async () => {
    toast.success('Salvo', { duration: 1000 });
    await render();
    const t = el.querySelector('.toast')!;

    t.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(5000);
    await render();
    expect(shown()).toEqual(['Salvo']);

    t.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(1000);
    await render();
    expect(shown()).toEqual([]);
  });

  it('keyboard focus inside the stack pauses too, until it leaves', async () => {
    toast.info('Arquivo enviado', { duration: 1000, dismissible: true });
    await render();
    const close = el.querySelector<HTMLButtonElement>('.toast-close')!;

    close.focus();
    vi.advanceTimersByTime(5000);
    await render();
    expect(shown()).toEqual(['Arquivo enviado']);

    close.blur();
    vi.advanceTimersByTime(1000);
    await render();
    expect(shown()).toEqual([]);
  });

  it('closing the hovered toast does not leave the others paused', async () => {
    toast.info('fica', { duration: 1000 });
    toast.info('fecha', { duration: 0 });
    await render();
    const [first] = Array.from(el.querySelectorAll('.toast'));
    first.dispatchEvent(new MouseEvent('mouseenter'));
    first.querySelector<HTMLButtonElement>('.toast-close')!.click(); // fecha "fecha" (o mais novo)
    await render();
    expect(shown()).toEqual(['fica']);

    vi.advanceTimersByTime(1000);
    await render();
    expect(shown()).toEqual([]);
  });

  it('the action runs and closes its toast', async () => {
    const onAction = vi.fn();
    toast.info('Item removido', { actionLabel: 'Desfazer', onAction });
    await render();
    el.querySelector<HTMLButtonElement>('.toast-action')!.click();
    await render();
    expect(onAction).toHaveBeenCalledOnce();
    expect(shown()).toEqual([]);
  });
});
