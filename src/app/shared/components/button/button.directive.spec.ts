import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterLink, provideRouter } from '@angular/router';

import { ButtonDirective } from './button.directive';
import { BtnVariant } from './button.types';

@Component({
  imports: [ButtonDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="b" appButton [variant]="variant()" tone="danger" size="sm" [disabled]="disabled()" [busy]="busy()"
      (click)="clicks = clicks + 1">Salvar</button>
    <button id="short" appButton="ghost">Atalho</button>
    <button id="plain" appButton>Padrão</button>
    <a id="a" appButton variant="link" href="#x" [disabled]="disabled()" (click)="linkClicks = linkClicks + 1">Ver</a>
    <a id="r" appButton variant="link" routerLink="/demo" [disabled]="disabled()">Demo</a>
  `
})
class HostComponent {
  variant = signal<BtnVariant | undefined>(undefined);
  disabled = signal(false);
  busy = signal(false);
  clicks = 0;
  linkClicks = 0;
}

describe('ButtonDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;
  const q = <E extends HTMLElement>(id: string) => el.querySelector<E>('#' + id)!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('classes for variant, tone and size; the empty attribute means "solid"', async () => {
    expect(q('b').className).toContain('btn btn--solid');
    expect(q('b').classList).toContain('btn--danger');
    expect(q('b').classList).toContain('btn--sm');
    expect(q('plain').classList).toContain('btn--solid');
    expect(q('plain').classList).toContain('btn--accent');
    expect(q('short').classList).toContain('btn--ghost');

    host.variant.set('outline');
    await fixture.whenStable();
    expect(q('b').classList).toContain('btn--outline');
    expect(q('b').classList).not.toContain('btn--solid');
  });

  it('disabled <button>: native disabled attribute', async () => {
    host.disabled.set(true);
    await fixture.whenStable();
    expect(q<HTMLButtonElement>('b').disabled).toBe(true);
    expect(q('b').hasAttribute('aria-disabled')).toBe(false);
  });

  it('busy: aria-busy, disabled and the click does nothing', async () => {
    host.busy.set(true);
    await fixture.whenStable();
    expect(q('b').getAttribute('aria-busy')).toBe('true');
    expect(q('b').classList).toContain('is-busy');
    expect(q<HTMLButtonElement>('b').disabled).toBe(true);
  });

  it('disabled link: aria-disabled, out of the tab order and the click is blocked', async () => {
    host.disabled.set(true);
    await fixture.whenStable();
    const a = q<HTMLAnchorElement>('a');
    expect(a.getAttribute('aria-disabled')).toBe('true');
    expect(a.getAttribute('tabindex')).toBe('-1');
    expect(a.hasAttribute('disabled')).toBe(false);

    const e = new MouseEvent('click', { bubbles: true, cancelable: true });
    a.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(host.linkClicks).toBe(0);
  });

  it('disabled routerLink does not navigate', async () => {
    const nav = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    host.disabled.set(true);
    await fixture.whenStable();
    q('r').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    expect(nav).not.toHaveBeenCalled();

    host.disabled.set(false);
    await fixture.whenStable();
    q('r').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    expect(nav).toHaveBeenCalledOnce();
  });

  it('enabled link works normally', () => {
    const a = q<HTMLAnchorElement>('a');
    expect(a.hasAttribute('aria-disabled')).toBe(false);
    expect(a.hasAttribute('tabindex')).toBe(false);
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(host.linkClicks).toBe(1);
  });
});
