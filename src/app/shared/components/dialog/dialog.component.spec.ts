import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { stubLayout } from '../../../../testing/layout-stub';

import { DialogSize } from './dialog.types';

import { DialogComponent } from './dialog.component';

@Component({
  imports: [DialogComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="opener" type="button">Abrir</button>
    <p id="outside">Fundo</p>
    <p id="already-inert" inert>Já inerte</p>
    <p id="keep" data-dialog-keep-active>Avisos</p>
    <app-dialog title="Teste" [size]="size()" [(opened)]="opened" [describedBy]="describedBy()">
      <p id="dlg-test-desc">Descrição do dialog.</p>
      <div [style.width.px]="contentWidth()" style="height: 10px"></div>
    </app-dialog>
  `
})
class HostComponent {
  size = signal<DialogSize>('auto');
  opened = signal(false);
  contentWidth = signal(800);
  describedBy = signal<string | null>(null);
}

/** Espera o ResizeObserver disparar e o Angular renderizar. */
async function settle(fixture: ComponentFixture<unknown>) {
  await new Promise(r => requestAnimationFrame(() => setTimeout(r)));
  await fixture.whenStable();
}

function dialogEl(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector('.dlg');
}

describe('DialogComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  let restoreLayout: () => void;

  beforeEach(async () => {
    restoreLayout = stubLayout();

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    restoreLayout();
  });

  it('does not render while closed', () => {
    expect(dialogEl(fixture)).toBeNull();
  });

  it('size="auto" measures content after opening (content only exists while open)', async () => {
    host.opened.set(true);
    await settle(fixture);

    // 800px de conteúdo não cabe no md (<720) → lg
    expect(dialogEl(fixture)?.classList).toContain('dlg--lg');
  });

  it('size="auto" keeps measuring after close and reopen', async () => {
    host.opened.set(true);
    await settle(fixture);
    host.opened.set(false);
    await settle(fixture);

    host.contentWidth.set(1000);
    host.opened.set(true);
    await settle(fixture);

    expect(dialogEl(fixture)?.classList).toContain('dlg--xl');
  });

  it('does not touch body overflow until it is opened', async () => {
    fixture.destroy();
    document.body.style.overflow = 'scroll';

    const f = TestBed.createComponent(HostComponent);
    await f.whenStable();
    expect(document.body.style.overflow).toBe('scroll');

    f.componentInstance.opened.set(true);
    await f.whenStable();
    expect(document.body.style.overflow).toBe('hidden');

    f.componentInstance.opened.set(false);
    await f.whenStable();
    expect(document.body.style.overflow).toBe('scroll');

    f.destroy();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.style.overflow = '';
  });

  it('emits openedChange only when the state changes', async () => {
    const dlg = fixture.debugElement.query(By.directive(DialogComponent)).componentInstance as DialogComponent;
    const emitted: boolean[] = [];
    dlg.opened.subscribe(v => emitted.push(v)); // o model() é o próprio openedChange

    await fixture.whenStable();
    expect(emitted).toEqual([]);

    dlg.openDialog();
    await fixture.whenStable();
    dlg.close();
    await fixture.whenStable();
    expect(emitted).toEqual([true, false]);
  });

  it('applies a fixed size and reacts to size changes', async () => {
    host.size.set('sm');
    host.opened.set(true);
    await settle(fixture);
    expect(dialogEl(fixture)?.classList).toContain('dlg--sm');

    host.size.set('lg');
    await settle(fixture);
    expect(dialogEl(fixture)?.classList).toContain('dlg--lg');
  });

  it('omits aria-describedby when describedBy is not set', async () => {
    host.opened.set(true);
    await settle(fixture);
    expect(dialogEl(fixture)?.hasAttribute('aria-describedby')).toBe(false);

    host.describedBy.set('');
    await settle(fixture);
    expect(dialogEl(fixture)?.hasAttribute('aria-describedby')).toBe(false);
  });

  it('links aria-describedby to the given id and keeps aria-labelledby on the title', async () => {
    host.describedBy.set('dlg-test-desc');
    host.opened.set(true);
    await settle(fixture);

    const dlg = dialogEl(fixture)!;
    expect(dlg.getAttribute('aria-describedby')).toBe('dlg-test-desc');
    expect(document.getElementById('dlg-test-desc')?.textContent).toContain('Descrição do dialog.');

    const title = document.getElementById(dlg.getAttribute('aria-labelledby')!);
    expect(title?.textContent?.trim()).toBe('Teste');
  });

  it('updates aria-describedby when describedBy changes', async () => {
    host.describedBy.set('a');
    host.opened.set(true);
    await settle(fixture);
    host.describedBy.set('a b');
    await settle(fixture);
    expect(dialogEl(fixture)?.getAttribute('aria-describedby')).toBe('a b');
  });

  describe('focus restore and inert background', () => {
    const byId = (id: string) => document.getElementById(id) as HTMLElement;

    it('focuses the close button on open and returns focus to the opener on close', async () => {
      byId('opener').focus();
      host.opened.set(true);
      await settle(fixture);
      expect(document.activeElement?.classList).toContain('dlg__close');

      host.opened.set(false);
      await settle(fixture);
      expect(document.activeElement).toBe(byId('opener'));
    });

    it('also returns focus when closed from inside (Esc)', async () => {
      byId('opener').focus();
      host.opened.set(true);
      await settle(fixture);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await settle(fixture);
      expect(host.opened()).toBe(false);
      expect(document.activeElement).toBe(byId('opener'));
    });

    it('does not throw nor steal focus if the opener was removed meanwhile', async () => {
      byId('opener').focus();
      host.opened.set(true);
      await settle(fixture);
      byId('opener').remove();

      host.opened.set(false);
      await settle(fixture);
      expect(document.activeElement?.id).not.toBe('opener');
    });

    it('makes the background inert while open, but not the dialog itself', async () => {
      host.opened.set(true);
      await settle(fixture);

      expect(byId('outside').hasAttribute('inert')).toBe(true);
      expect(byId('opener').hasAttribute('inert')).toBe(true);
      expect(dialogEl(fixture)!.closest('[inert]')).toBeNull();
    });

    it('keeps elements marked with data-dialog-keep-active interactive', async () => {
      host.opened.set(true);
      await settle(fixture);
      expect(byId('keep').hasAttribute('inert')).toBe(false);
    });

    it('releases only what it marked: already-inert elements stay inert', async () => {
      host.opened.set(true);
      await settle(fixture);
      host.opened.set(false);
      await settle(fixture);

      expect(byId('outside').hasAttribute('inert')).toBe(false);
      expect(byId('opener').hasAttribute('inert')).toBe(false);
      expect(byId('already-inert').hasAttribute('inert')).toBe(true);
    });

    it('releases the background if destroyed while open', async () => {
      host.opened.set(true);
      await settle(fixture);
      const outside = byId('outside');

      fixture.destroy();
      expect(outside.hasAttribute('inert')).toBe(false);
    });
  });
});
