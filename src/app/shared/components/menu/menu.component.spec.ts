import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MENU_IMPORTS } from './index';
import { MENU_GAP, MENU_MARGIN, placeMenu } from './menu-position';

@Component({
  imports: [...MENU_IMPORTS],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="before" type="button">antes</button>
    <button id="trigger" type="button" [appMenuTrigger]="menu">Ações</button>
    <app-menu #menu (openedChange)="events.push($event)">
      <button appMenuItem (click)="act('editar')">Editar</button>
      <button appMenuItem (click)="act('duplicar')">Duplicar</button>
      <a appMenuItem href="#arquivar" (click)="$event.preventDefault(); act('arquivar')">Arquivar</a>
      <button appMenuItem disabled (click)="act('mover')">Mover</button>
      <hr appMenuSeparator>
      <button appMenuItem tone="danger" (click)="act('excluir')">Excluir</button>
    </app-menu>
    <button id="after" type="button">depois</button>
  `
})
class HostComponent {
  acted = signal<string[]>([]);
  focusedDuringAction: Element | null = null;
  events: boolean[] = [];
  act(what: string) {
    this.focusedDuringAction = document.activeElement;
    this.acted.update(a => [...a, what]);
  }
}

describe('MenuComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const trigger = () => el.querySelector<HTMLButtonElement>('#trigger')!;
  const panel = () => el.querySelector<HTMLElement>('[role="menu"]')!;
  const items = () => Array.from(el.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  const item = (text: string) => items().find(i => i.textContent!.trim() === text)!;
  const focused = () => document.activeElement?.textContent?.trim();
  const settle = async () => { await fixture.whenStable(); await new Promise(r => setTimeout(r)); await fixture.whenStable(); };
  const key = async (target: Element, k: string, init: KeyboardEventInit = {}) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(e);
    await settle();
    return e;
  };
  const open = async () => { trigger().focus(); trigger().click(); await settle(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('closed: the trigger says it has a menu; the menu and its items are hidden', () => {
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().hasAttribute('aria-controls')).toBe(false);
    expect(panel().hidden).toBe(true);
  });

  it('click opens it on the first item; the menu is named by the trigger', async () => {
    await open();
    expect(panel().hidden).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(panel().id);
    expect(panel().getAttribute('aria-labelledby')).toBe('trigger');
    expect(focused()).toBe('Editar');
    expect(host.events).toEqual([true]);
  });

  it('items: role menuitem, out of the Tab order, button type; separator role', () => {
    expect(items().every(i => i.getAttribute('tabindex') === '-1')).toBe(true);
    expect((item('Editar') as HTMLButtonElement).type).toBe('button');
    expect(el.querySelector('hr')!.getAttribute('role')).toBe('separator');
    expect(item('Excluir').classList).toContain('menu__item--danger');
  });

  it('↓ / ↑ on the trigger open on the first / last item', async () => {
    await key(trigger(), 'ArrowUp');
    expect(focused()).toBe('Excluir');
    await key(document.activeElement!, 'Escape');
    await key(trigger(), 'ArrowDown');
    expect(focused()).toBe('Editar');
  });

  it('arrows move and wrap; Home/End; disabled items are still reachable', async () => {
    await open();
    await key(document.activeElement!, 'ArrowUp');
    expect(focused()).toBe('Excluir');
    await key(document.activeElement!, 'ArrowDown');
    expect(focused()).toBe('Editar');
    await key(document.activeElement!, 'End');
    await key(document.activeElement!, 'ArrowUp');
    expect(focused()).toBe('Mover');
    expect(item('Mover').getAttribute('aria-disabled')).toBe('true');
    expect(item('Mover').hasAttribute('disabled')).toBe(false); // continua focável
    await key(document.activeElement!, 'Home');
    expect(focused()).toBe('Editar');
  });

  it('typing jumps to the next item with that initial (repeating cycles)', async () => {
    await open();
    await key(document.activeElement!, 'a');
    expect(focused()).toBe('Arquivar');
    await new Promise(r => setTimeout(r, 550)); // a busca recomeça depois de uma pausa
    await key(document.activeElement!, 'e');
    expect(focused()).toBe('Excluir');
    await key(document.activeElement!, 'e');
    expect(focused()).toBe('Editar');
  });

  it('Esc closes, returns focus to the trigger and does not reach a Dialog behind', async () => {
    await open();
    const outer = vi.fn();
    document.addEventListener('keydown', outer);
    const e = await key(document.activeElement!, 'Escape');
    document.removeEventListener('keydown', outer);
    expect(e.defaultPrevented).toBe(true);
    expect(outer).not.toHaveBeenCalled();
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });

  it('choosing an item closes the menu and returns focus to the trigger before the action runs', async () => {
    await open();
    item('Duplicar').click();
    await settle();
    expect(host.acted()).toEqual(['duplicar']);
    // se a ação abrir um Dialog, ele guarda o botão do menu para devolver o foco
    expect(host.focusedDuringAction).toBe(trigger());
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });

  it('Space also chooses a link item (links only react to Enter natively)', async () => {
    await open();
    item('Arquivar').focus();
    await key(item('Arquivar'), ' ');
    expect(host.acted()).toEqual(['arquivar']);
    expect(panel().hidden).toBe(true);
  });

  it('a disabled item does nothing and keeps the menu open', async () => {
    await open();
    item('Mover').click();
    await settle();
    expect(host.acted()).toEqual([]);
    expect(panel().hidden).toBe(false);
  });

  it('focus leaving the menu (Tab, another field) closes it without taking focus back', async () => {
    await open();
    el.querySelector<HTMLButtonElement>('#after')!.focus();
    await settle();
    expect(panel().hidden).toBe(true);
    expect(document.activeElement?.id).toBe('after');
  });

  it('pointer down outside closes it; on the trigger it toggles instead', async () => {
    await open();
    el.querySelector('#before')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await settle();
    expect(panel().hidden).toBe(true);

    await open();
    trigger().dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    trigger().click();
    await settle();
    expect(panel().hidden).toBe(true);
    expect(host.events).toEqual([true, false, true, false]);
  });
});

describe('placeMenu', () => {
  const viewport = { width: 1000, height: 800 };
  const menu = { width: 200, height: 160 };

  it('below the trigger, aligned to its start', () => {
    const p = placeMenu('bottom-start', { top: 100, left: 300, width: 120, height: 40 }, menu, viewport);
    expect(p).toMatchObject({ placement: 'bottom-start', top: 100 + 40 + MENU_GAP, left: 300 });
  });

  it('end alignment lines up the right edges', () => {
    const p = placeMenu('bottom-end', { top: 100, left: 300, width: 120, height: 40 }, menu, viewport);
    expect(p.left).toBe(300 + 120 - 200);
  });

  it('flips up when there is no room below, and stays inside the window', () => {
    const p = placeMenu('bottom-start', { top: 720, left: 950, width: 40, height: 40 }, menu, viewport);
    expect(p.placement).toBe('top-start');
    expect(p.top).toBe(720 - MENU_GAP - 160);
    expect(p.left).toBe(1000 - 200 - MENU_MARGIN);
  });

  it('a menu taller than the space gets a max height (it scrolls)', () => {
    const p = placeMenu('bottom-start', { top: 380, left: 10, width: 40, height: 40 }, { width: 200, height: 2000 }, viewport);
    expect(p.maxHeight).toBeLessThan(2000);
    expect(p.top + p.maxHeight).toBeLessThanOrEqual(800 - MENU_MARGIN);
  });
});
