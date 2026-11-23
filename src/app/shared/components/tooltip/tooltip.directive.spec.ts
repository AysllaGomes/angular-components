import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDirective } from './tooltip.directive';
import { placeTooltip } from './tooltip-position';

describe('placeTooltip', () => {
  const viewport = { width: 1000, height: 800 };
  const tip = { width: 100, height: 30 };
  const anchor = (left: number, top: number) => ({ left, top, width: 40, height: 20 });

  it('centers above the anchor by default, with the arrow on its center', () => {
    const p = placeTooltip('top', anchor(480, 400), tip, viewport);
    expect(p).toEqual({ position: 'top', top: 400 - 30 - 8, left: 450, arrow: 50 });
  });

  it('flips to the opposite side when there is no room', () => {
    expect(placeTooltip('top', anchor(480, 10), tip, viewport).position).toBe('bottom');
    expect(placeTooltip('bottom', anchor(480, 780), tip, viewport).position).toBe('top');
    expect(placeTooltip('left', anchor(5, 400), tip, viewport).position).toBe('right');
    expect(placeTooltip('right', anchor(950, 400), tip, viewport).position).toBe('left');
  });

  it('keeps the preferred side when neither fits but it has more room', () => {
    const tall = { width: 100, height: 500 };
    expect(placeTooltip('top', { left: 480, top: 420, width: 40, height: 20 }, tall, viewport).position).toBe('top');
  });

  it('stays inside the viewport and the arrow still points at the anchor', () => {
    const p = placeTooltip('top', anchor(0, 400), tip, viewport);
    expect(p.left).toBe(8);
    expect(p.arrow).toBe(12); // centro do alvo (20) cairia a 12px da borda: limite do canto
    const right = placeTooltip('bottom', anchor(960, 400), tip, viewport);
    expect(right.left).toBe(1000 - 100 - 8);
    expect(right.arrow).toBe(980 - 892);
  });

  it('left/right center vertically', () => {
    const p = placeTooltip('right', anchor(480, 400), tip, viewport);
    expect(p).toEqual({ position: 'right', top: 395, left: 528, arrow: 15 });
  });
});

@Component({
  imports: [TooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="edit" type="button" [appTooltip]="text()" [tooltipDisabled]="off()" aria-describedby="extra">✎</button>
    <span id="extra">Atalho: E</span>
    <button id="icon" type="button" appTooltip="Excluir" tooltipAsLabel tooltipShowDelay="0">🗑</button>
    <button id="other" type="button">Sem dica</button>
  `
})
class HostComponent {
  text = signal<string | null>('Editar');
  off = signal(false);
}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  const btn = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(`#${id}`)!;
  const tipOf = (id: string) => {
    const ids = `${btn(id).getAttribute('aria-describedby') ?? ''} ${btn(id).getAttribute('aria-labelledby') ?? ''}`;
    const tipId = ids.split(/\s+/).find(t => t.startsWith('tip-'));
    return tipId ? document.getElementById(tipId) : null;
  };
  const pointer = (el: Element, type: string, pointerType = 'mouse') =>
    el.dispatchEvent(new PointerEvent(type, { bubbles: type === 'pointerdown', pointerType }));
  const key = (k: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.tick();
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('creates a hidden role="tooltip" in the body, linked as a description (keeps existing ids)', () => {
    const tip = tipOf('edit')!;
    expect(tip.getAttribute('role')).toBe('tooltip');
    expect(tip.parentElement).toBe(document.body);
    expect(tip.hidden).toBe(true);
    expect(tip.textContent).toBe('Editar');
    expect(btn('edit').getAttribute('aria-describedby')).toBe(`extra ${tip.id}`);
  });

  it('tooltipAsLabel names the element (aria-labelledby) instead of describing it', () => {
    const tip = tipOf('icon')!;
    expect(btn('icon').getAttribute('aria-labelledby')).toBe(tip.id);
    expect(btn('icon').hasAttribute('aria-describedby')).toBe(false);
  });

  it('opens after the delay on hover and closes shortly after leaving', () => {
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(299);
    expect(tipOf('edit')!.hidden).toBe(true);
    vi.advanceTimersByTime(1);
    expect(tipOf('edit')!.hidden).toBe(false);
    expect(tipOf('edit')!.dataset['position']).toBeTruthy();

    pointer(btn('edit'), 'pointerleave');
    expect(tipOf('edit')!.hidden).toBe(false);
    vi.advanceTimersByTime(100);
    expect(tipOf('edit')!.hidden).toBe(true);
  });

  it('stays open while the pointer moves onto the bubble (WCAG 1.4.13 hoverable)', () => {
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(300);
    const tip = tipOf('edit')!;
    pointer(btn('edit'), 'pointerleave');
    pointer(tip, 'pointerenter');
    vi.advanceTimersByTime(1000);
    expect(tip.hidden).toBe(false);
    pointer(tip, 'pointerleave');
    vi.advanceTimersByTime(100);
    expect(tip.hidden).toBe(true);
  });

  it('Esc closes it without moving focus and it stays closed until the pointer leaves', () => {
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(300);
    const outer = vi.fn();
    document.addEventListener('keydown', outer);
    key('Escape');
    document.removeEventListener('keydown', outer);
    expect(tipOf('edit')!.hidden).toBe(true);
    expect(outer).not.toHaveBeenCalled(); // um Dialog por trás não fecha junto

    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(1000);
    expect(tipOf('edit')!.hidden).toBe(true);

    pointer(btn('edit'), 'pointerleave');
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(300);
    expect(tipOf('edit')!.hidden).toBe(false);
  });

  it('Esc does nothing (and is not swallowed) when no tooltip is open', () => {
    const outer = vi.fn();
    document.addEventListener('keydown', outer);
    key('Escape');
    document.removeEventListener('keydown', outer);
    expect(outer).toHaveBeenCalled();
  });

  it('keyboard focus opens it right away; blur closes it', () => {
    btn('edit').focus();
    expect(tipOf('edit')!.hidden).toBe(false);
    btn('other').focus();
    vi.advanceTimersByTime(100);
    expect(tipOf('edit')!.hidden).toBe(true);
  });

  it('clicking closes it; touch never opens it', () => {
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(300);
    pointer(btn('edit'), 'pointerdown');
    expect(tipOf('edit')!.hidden).toBe(true);

    pointer(btn('icon'), 'pointerenter', 'touch');
    vi.advanceTimersByTime(1000);
    expect(tipOf('icon')!.hidden).toBe(true);
  });

  it('only one is open at a time, and moving between them skips the delay', () => {
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(300);
    pointer(btn('edit'), 'pointerleave');
    // a de "icon" tem espera 0, mas a regra vale para qualquer uma: abre já e fecha a outra
    pointer(btn('icon'), 'pointerenter');
    expect(tipOf('icon')!.hidden).toBe(false);
    expect(tipOf('edit')!.hidden).toBe(true);
  });

  it('empty text or tooltipDisabled turns it off and unlinks it', () => {
    pointer(btn('edit'), 'pointerenter');
    vi.advanceTimersByTime(300);
    const tipId = tipOf('edit')!.id;

    host.off.set(true);
    fixture.detectChanges();
    TestBed.tick();
    expect(document.getElementById(tipId)!.hidden).toBe(true);
    expect(btn('edit').getAttribute('aria-describedby')).toBe('extra');

    host.off.set(false);
    host.text.set('  ');
    fixture.detectChanges();
    TestBed.tick();
    expect(btn('edit').getAttribute('aria-describedby')).toBe('extra');

    host.text.set('Editar item');
    fixture.detectChanges();
    TestBed.tick();
    expect(tipOf('edit')!.textContent).toBe('Editar item');
  });

  it('removes the bubble from the body when destroyed', () => {
    const id = tipOf('edit')!.id;
    fixture.destroy();
    expect(document.getElementById(id)).toBeNull();
  });
});
