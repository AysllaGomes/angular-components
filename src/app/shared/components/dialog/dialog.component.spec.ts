import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { stubLayout } from '../../../../testing/layout-stub';

import { DialogSize } from '../../model/type/dialog-size.type';

import { DialogComponent } from './dialog.component';

@Component({
  imports: [DialogComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-dialog title="Teste" [size]="size()" [opened]="opened()">
      <div [style.width.px]="contentWidth()" style="height: 10px"></div>
    </app-dialog>
  `
})
class HostComponent {
  size = signal<DialogSize>('auto');
  opened = signal(false);
  contentWidth = signal(800);
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
    const dlg = fixture.debugElement.children[0].componentInstance as DialogComponent;
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
});
