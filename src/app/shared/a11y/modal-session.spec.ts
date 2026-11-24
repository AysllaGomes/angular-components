import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UI_LABELS_PT, provideUiLabels } from '../labels';
import { ActionBarComponent } from '../components/actionbar/actionbar.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { SelectComponent } from '../components/select/select.component';

/** caso comum: uma ActionBar aberta e, por cima dela, um Dialog de confirmação com um Select */
@Component({
  imports: [ActionBarComponent, DialogComponent, SelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="opener" type="button">abrir</button>
    <app-actionbar title="Pedido" [(opened)]="bar">
      <button id="del" type="button">Excluir</button>
    </app-actionbar>
    <app-dialog title="Confirmar" [(opened)]="dlg">
      <app-select label="Motivo" responsive="menu" [options]="motivos" />
      <button id="ok" type="button">Confirmar</button>
    </app-dialog>
  `
})
class HostComponent {
  bar = signal(false);
  dlg = signal(false);
  motivos = [{ label: 'Duplicado', value: 'dup' }, { label: 'Erro', value: 'err' }];
}

describe('Modais empilhados (ModalSession)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const settle = async () => { await fixture.whenStable(); await new Promise(r => setTimeout(r)); await fixture.whenStable(); };
  const press = async (key: string, target: EventTarget = document.activeElement ?? document, init: KeyboardEventInit = {}) => {
    const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(e);
    await settle();
    return e;
  };
  const openBoth = async () => {
    el.querySelector<HTMLButtonElement>('#opener')!.focus();
    host.bar.set(true);
    await settle();
    el.querySelector<HTMLButtonElement>('#del')!.focus();
    host.dlg.set(true);
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await settle();
  });

  afterEach(() => {
    fixture.destroy();
    el.remove();
  });

  it('the modal on top is usable: the one below made it inert, it comes back to life', async () => {
    await openBoth();
    const dialog = el.querySelector('app-dialog')!;
    const bar = el.querySelector('app-actionbar')!;
    expect(dialog.closest('[inert]')).toBeNull();
    expect(bar.closest('[inert]')).not.toBeNull();

    // fecha o de cima: ele volta a ser fundo da ActionBar, que volta a ser usável
    host.dlg.set(false);
    await settle();
    expect(dialog.closest('[inert]')).not.toBeNull();
    expect(bar.closest('[inert]')).toBeNull();
  });

  it('Esc closes only the modal on top; the next Esc closes the one below', async () => {
    await openBoth();
    await press('Escape');
    expect(host.dlg()).toBe(false);
    expect(host.bar()).toBe(true);
    // o foco volta para quem abriu o Dialog, dentro da ActionBar
    expect(document.activeElement?.id).toBe('del');

    await press('Escape');
    expect(host.bar()).toBe(false);
    expect(document.activeElement?.id).toBe('opener');
    expect(document.querySelectorAll('[inert]').length).toBe(0);
  });

  it('Esc that closes a Select panel inside the Dialog does not close the Dialog', async () => {
    await openBoth();
    el.querySelector<HTMLButtonElement>('app-dialog button.control')!.click();
    await settle();
    expect(el.querySelector('app-dialog [role="listbox"]')).not.toBeNull();

    await press('Escape');
    expect(el.querySelector('app-dialog [role="listbox"]')).toBeNull();
    expect(host.dlg()).toBe(true);
    expect(host.bar()).toBe(true);
  });

  it('Tab stays inside the modal on top (wraps at both ends)', async () => {
    await openBoth();
    const dialog = el.querySelector<HTMLElement>('app-dialog')!;
    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled])'));
    const first = focusables[0], last = focusables[focusables.length - 1];

    last.focus();
    expect((await press('Tab')).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    expect((await press('Tab', first, { shiftKey: true })).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('Tab with focus outside the modal brings it back in', async () => {
    await openBoth();
    (document.activeElement as HTMLElement | null)?.blur();
    expect((await press('Tab', document)).defaultPrevented).toBe(true);
    expect(el.querySelector('app-dialog')!.contains(document.activeElement)).toBe(true);
  });
});
