import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
// os testes conferem os textos em português (o padrão dos componentes é inglês)
import { UI_LABELS_PT, provideUiLabels } from '../../labels';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { TreeNode, TreeSelectionMode } from './tree-select.types';

import { TreeSelectComponent, TreeSelectValue } from './tree-select.component';

const TREE: TreeNode[] = [
  { key: 'br', label: 'Brasil', children: [
    { key: 'sp', label: 'São Paulo', children: [
      { key: 'campinas', label: 'Campinas' },
      { key: 'santos', label: 'Santos' },
    ] },
    { key: 'rj', label: 'Rio de Janeiro', children: [
      { key: 'niteroi', label: 'Niterói', disabled: true },
      { key: 'petropolis', label: 'Petrópolis' },
    ] },
  ] },
  { key: 'pt', label: 'Portugal', children: [
    { key: 'lisboa', label: 'Lisboa' },
  ] },
];

@Component({
  imports: [TreeSelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="before" type="button">antes</button>
    <app-tree-select label="Local" responsive="menu" placeholder="Escolha"
      [nodes]="nodes" [selectionMode]="mode()" [leafOnly]="leafOnly()" [filterable]="filterable()"
      [expandedKeys]="expandedKeys()" [maxChips]="2" [clearable]="true" [(value)]="value" />
    <button id="after" type="button">depois</button>
  `
})
class HostComponent {
  nodes = TREE;
  mode = signal<TreeSelectionMode>('single');
  leafOnly = signal(false);
  filterable = signal(false);
  expandedKeys = signal<string[]>([]);
  value = signal<TreeSelectValue>(null);
}

describe('TreeSelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const button = () => el.querySelector<HTMLButtonElement>('button.control')!;
  const tree = () => el.querySelector<HTMLElement>('[role="tree"]');
  const items = () => Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]'));
  const labels = () => items().map(i => i.querySelector('.node-label')!.textContent!.trim());
  const item = (label: string) => items().find(i => i.querySelector('.node-label')!.textContent!.trim() === label)!;
  const active = () => el.querySelector('.node.is-active .node-label')?.textContent?.trim();
  const shown = () => el.querySelector('.control .value')!.textContent!.replace(/\s+/g, ' ').trim();
  const key = async (target: Element, k: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }));
    await fixture.whenStable();
  };
  const flush = async () => { await new Promise(r => setTimeout(r)); await fixture.whenStable(); };
  const openPanel = async () => { button().click(); await flush(); };

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

  describe('tree rendering and ARIA', () => {
    it('opens a role="tree" with the roots collapsed; expandedKeys opens nodes initially', async () => {
      await openPanel();
      expect(tree()).not.toBeNull();
      expect(labels()).toEqual(['Brasil', 'Portugal']);
      expect(item('Brasil').getAttribute('aria-expanded')).toBe('false');
      expect(item('Brasil').getAttribute('aria-level')).toBe('1');
      expect(button().getAttribute('aria-expanded')).toBe('true');

      host.expandedKeys.set(['br']);
      await fixture.whenStable();
      expect(labels()).toEqual(['Brasil', 'São Paulo', 'Rio de Janeiro', 'Portugal']);
      expect(item('São Paulo').getAttribute('aria-level')).toBe('2');
      expect(item('São Paulo').getAttribute('aria-posinset')).toBe('1');
      expect(item('São Paulo').getAttribute('aria-setsize')).toBe('2');
    });

    it('the twisty expands/collapses without selecting', async () => {
      await openPanel();
      item('Brasil').querySelector<HTMLElement>('.twisty')!.click();
      await fixture.whenStable();
      expect(labels()).toContain('São Paulo');
      expect(host.value()).toBeNull();
    });
  });

  describe('single mode', () => {
    it('selecting closes, shows the path and returns focus to the field', async () => {
      host.expandedKeys.set(['br', 'sp']);
      await openPanel();
      item('Campinas').click();
      await flush();

      expect(host.value()).toBe('campinas');
      expect(tree()).toBeNull();
      expect(shown()).toBe('Brasil › São Paulo › Campinas');
      expect(document.activeElement).toBe(button());
    });

    it('a parent can be chosen by default; leafOnly makes clicking it just expand', async () => {
      await openPanel();
      item('Brasil').click();
      await flush();
      expect(host.value()).toBe('br');

      host.leafOnly.set(true);
      host.value.set(null);
      await fixture.whenStable();
      await openPanel();
      item('Portugal').click();
      await fixture.whenStable();
      expect(host.value()).toBeNull();
      expect(labels()).toContain('Lisboa');
    });

    it('disabled nodes cannot be chosen', async () => {
      host.expandedKeys.set(['br', 'rj']);
      await openPanel();
      expect(item('Niterói').getAttribute('aria-disabled')).toBe('true');
      item('Niterói').click();
      await fixture.whenStable();
      expect(host.value()).toBeNull();
    });

    it('reopening expands the ancestors of the selected node and makes it active', async () => {
      host.value.set('petropolis');
      await fixture.whenStable();
      await openPanel();
      expect(labels()).toContain('Petrópolis');
      expect(active()).toBe('Petrópolis');
      expect(item('Petrópolis').getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('checkbox mode', () => {
    beforeEach(async () => {
      host.mode.set('checkbox');
      host.value.set([]);
      host.expandedKeys.set(['br', 'sp', 'rj']);
      await fixture.whenStable();
      await openPanel();
    });

    it('checking a group checks its enabled leaves; the value has only leaf keys, in tree order', async () => {
      item('Brasil').click();
      await fixture.whenStable();
      expect(host.value()).toEqual(['campinas', 'santos', 'petropolis']);
      expect(item('Brasil').getAttribute('aria-checked')).toBe('true');
      expect(item('Niterói').getAttribute('aria-checked')).toBe('false');
      expect(tree()).not.toBeNull(); // continua aberto
    });

    it('partial groups are aria-checked="mixed" and clicking them completes the group', async () => {
      item('Santos').click();
      await fixture.whenStable();
      expect(item('São Paulo').getAttribute('aria-checked')).toBe('mixed');
      expect(item('Brasil').getAttribute('aria-checked')).toBe('mixed');
      expect(item('São Paulo').querySelector('app-checkbox-mark .bar')).not.toBeNull();

      item('São Paulo').click();
      await fixture.whenStable();
      expect(host.value()).toEqual(['campinas', 'santos']);

      item('São Paulo').click(); // completo → limpa
      await fixture.whenStable();
      expect(host.value()).toEqual([]);
    });

    it('the field shows chips with "+N" after maxChips', async () => {
      item('Brasil').click();
      await fixture.whenStable();
      const chips = Array.from(el.querySelectorAll('.control .chip')).map(c => c.textContent!.trim());
      expect(chips).toEqual(['Campinas', 'Santos', '+1']);
    });

    it('with a filter, checking a group checks only the visible leaves', async () => {
      host.filterable.set(true);
      await fixture.whenStable();
      button().click(); await flush(); // fecha
      await openPanel();

      const input = el.querySelector<HTMLInputElement>('.filter input')!;
      input.value = 'santos';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(labels()).toEqual(['Brasil', 'São Paulo', 'Santos']);

      item('Brasil').click();
      await fixture.whenStable();
      expect(host.value()).toEqual(['santos']);
    });
  });

  describe('keyboard (WAI-ARIA tree)', () => {
    beforeEach(async () => { await openPanel(); });

    it('focus goes to the tree, which uses aria-activedescendant', () => {
      expect(document.activeElement).toBe(tree());
      expect(tree()!.getAttribute('aria-activedescendant')).toBe(item('Brasil').id);
    });

    it('↓/↑ move, → expands then enters the child, ← goes to the parent then collapses', async () => {
      await key(tree()!, 'ArrowRight');
      expect(labels()).toContain('São Paulo');
      expect(active()).toBe('Brasil');

      await key(tree()!, 'ArrowRight');
      expect(active()).toBe('São Paulo');

      await key(tree()!, 'ArrowDown');
      expect(active()).toBe('Rio de Janeiro');

      await key(tree()!, 'ArrowLeft');
      expect(active()).toBe('Brasil');

      await key(tree()!, 'ArrowLeft');
      expect(labels()).toEqual(['Brasil', 'Portugal']);

      await key(tree()!, 'End');
      expect(active()).toBe('Portugal');
      await key(tree()!, 'Home');
      expect(active()).toBe('Brasil');
    });

    it('Enter selects the active node; Escape closes and returns focus', async () => {
      await key(tree()!, 'ArrowDown');
      await key(tree()!, 'Enter');
      await flush();
      expect(host.value()).toBe('pt');
      expect(tree()).toBeNull();

      await openPanel();
      await key(tree()!, 'Escape');
      await flush();
      expect(tree()).toBeNull();
      expect(document.activeElement).toBe(button());
    });

    it('Tab is not prevented; when focus leaves for the next field, the menu closes', async () => {
      const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      tree()!.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
      // o navegador move o foco (o jsdom não): o menu fecha quando ele sai do componente
      el.querySelector<HTMLButtonElement>('#after')!.focus();
      await fixture.whenStable();
      expect(tree()).toBeNull();
      expect(document.activeElement?.id).toBe('after');
    });

    it('typing jumps to the next visible node with that initial', async () => {
      await key(tree()!, 'p');
      expect(active()).toBe('Portugal');
    });
  });

  it('clicking outside closes the panel', async () => {
    await openPanel();
    document.getElementById('after')!.click();
    await fixture.whenStable();
    expect(tree()).toBeNull();
  });

  it('clear (×) empties the value', async () => {
    host.value.set('campinas');
    await fixture.whenStable();
    el.querySelector<HTMLButtonElement>('.clear-btn')!.click();
    await flush();
    expect(host.value()).toBeNull();
    expect(shown()).toBe('Escolha');
  });
});

// ===== Formulários =====

@Component({
  imports: [TreeSelectComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-tree-select label="Cidades" responsive="menu" selectionMode="checkbox" required
               [expandedKeys]="['br', 'sp']" [nodes]="nodes" [formControl]="ctrl" />`
})
class ReactiveHostComponent {
  nodes = TREE;
  ctrl = new FormControl<string[]>(['santos'], { nonNullable: true, validators: Validators.required });
}

describe('TreeSelectComponent with forms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)] });
  });

  it('reads/writes the control, validates required on close and follows disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveHostComponent);
    const host = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();

    expect(el.querySelector('.control .value')!.textContent).toContain('Santos');

    el.querySelector<HTMLButtonElement>('button.control')!.click();
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
    const santos = Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]'))
      .find(i => i.textContent!.includes('Santos'))!;
    santos.click(); // desmarca → vazio
    await fixture.whenStable();
    expect(host.ctrl.value).toEqual([]);
    expect(host.ctrl.dirty).toBe(true);

    el.querySelector<HTMLButtonElement>('button.control')!.click(); // fecha → valida
    await fixture.whenStable();
    expect(host.ctrl.touched).toBe(true);
    expect(el.querySelector('.error')!.textContent).toContain('Campo obrigatório');

    host.ctrl.disable();
    await fixture.whenStable();
    expect(el.querySelector<HTMLButtonElement>('button.control')!.disabled).toBe(true);
  });
});

@Component({
  imports: [TreeSelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-tree-select label="Local" responsive="menu" [filterable]="true" [nodes]="nodes"
      [hint]="hint()" [error]="error()" />
  `
})
class MessagesHostComponent {
  nodes = TREE;
  hint = signal<string | null>('Cidade ou estado');
  error = signal<string | null>(null);
}

describe('TreeSelectComponent: messages for assistive technology', () => {
  let fixture: ComponentFixture<MessagesHostComponent>;
  let host: MessagesHostComponent;
  let el: HTMLElement;
  const control = () => el.querySelector<HTMLButtonElement>('button.control')!;
  const describedText = () => {
    const id = control().getAttribute('aria-describedby');
    return id ? el.querySelector('#' + id)?.textContent?.trim() : null;
  };
  const status = () => el.querySelector('[role="status"]')!.textContent!.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(MessagesHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('the control is described by the message on screen: the hint, then the error instead', async () => {
    expect(describedText()).toBe('Cidade ou estado');

    host.error.set('Escolha um local');
    await fixture.whenStable();
    expect(describedText()).toBe('Escolha um local');

    host.error.set(null);
    host.hint.set(null);
    await fixture.whenStable();
    expect(control().hasAttribute('aria-describedby')).toBe(false);
  });

  it('a search with no match is announced in the status region', async () => {
    control().click();
    await new Promise(r => setTimeout(r));
    await fixture.whenStable();
    const input = el.querySelector<HTMLInputElement>('.filter input')!;
    const search = async (q: string) => {
      input.value = q;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };

    await search('Tóquio');
    expect(el.querySelectorAll('[role="treeitem"]').length).toBe(0);
    expect(status()).toBe(el.querySelector('.tree .empty')!.textContent!.trim());
    expect(status()).not.toBe('');

    await search('Santos');
    expect(status()).toBe('');
  });
});

@Component({
  imports: [TreeSelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-tree-select label="Local" [responsive]="mode()" [filterable]="true" [nodes]="nodes" />
    <button id="after" type="button">depois</button>
  `
})
class SheetHostComponent {
  nodes = TREE;
  mode = signal<'menu' | 'sheet'>('sheet');
}

describe('TreeSelectComponent: the sheet is modal', () => {
  let fixture: ComponentFixture<SheetHostComponent>;
  let el: HTMLElement;
  const control = () => el.querySelector<HTMLButtonElement>('button.control')!;
  const panel = () => el.querySelector<HTMLElement>('.panel');
  const settle = async () => { await fixture.whenStable(); await new Promise(r => setTimeout(r)); await fixture.whenStable(); };
  const open = async () => { control().focus(); control().click(); await settle(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(SheetHostComponent);
    el = fixture.nativeElement;
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('open as a menu, the window turns it into a sheet: it becomes modal; back to a menu: released', async () => {
    const host = fixture.componentInstance;
    host.mode.set('menu');
    await settle();
    await open();
    expect(document.body.style.overflow).toBe('');

    host.mode.set('sheet');
    await settle();
    window.dispatchEvent(new Event('resize'));
    await settle();
    expect(panel()!.classList).toContain('is-sheet');
    expect(el.querySelector('#after')!.closest('[inert]')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');

    host.mode.set('menu');
    await settle();
    window.dispatchEvent(new Event('resize'));
    await settle();
    expect(panel()).not.toBeNull();
    expect(document.querySelectorAll('[inert]').length).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });

  it('inert background and locked scroll while open; Tab stays inside', async () => {
    await open();
    expect(el.querySelector('#after')!.closest('[inert]')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');

    const treeEl = el.querySelector<HTMLElement>('[role="tree"]')!;
    treeEl.focus();
    const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    treeEl.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(panel()!.contains(document.activeElement)).toBe(true);
    expect(panel()).not.toBeNull();
  });

  for (const how of ['×', 'backdrop'] as const) {
    it(`closing by ${how} returns focus to the field and releases the page`, async () => {
      await open();
      el.querySelector<HTMLElement>(how === '×' ? '.sheet-close' : '.backdrop')!.click();
      await settle();
      expect(panel()).toBeNull();
      expect(document.activeElement).toBe(control());
      expect(document.querySelectorAll('[inert]').length).toBe(0);
      expect(document.body.style.overflow).toBe('');
    });
  }
});
