import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
// os testes conferem os textos em português (o padrão dos componentes é inglês)
import { UI_LABELS_PT, provideUiLabels } from '../../labels';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TreeNode, TreeSelectionMode, TreeValueMode } from './tree-select.types';

import { TreeChildrenLoader, TreeSelectComponent, TreeSelectValue } from './tree-select.component';

/** promessa controlada pelo teste */
function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

const LAZY: TreeNode[] = [
  { key: 'sp', label: 'São Paulo', leaf: false },
  { key: 'ba', label: 'Bahia', leaf: false },
  { key: 'rj', label: 'Rio de Janeiro', children: [
    { key: 'niteroi', label: 'Niterói', disabled: true },
    { key: 'petropolis', label: 'Petrópolis' },
  ] },
];

const SP: TreeNode[] = [{ key: 'campinas', label: 'Campinas' }, { key: 'santos', label: 'Santos' }];

@Component({
  imports: [TreeSelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-tree-select label="Local" responsive="menu" [maxChips]="5"
      [nodes]="nodes()" [selectionMode]="mode()" [valueMode]="valueMode()"
      [loadChildren]="loader()" [(value)]="value" />
  `
})
class HostComponent {
  nodes = signal<TreeNode[]>(LAZY);
  mode = signal<TreeSelectionMode>('single');
  valueMode = signal<TreeValueMode>('leaves');
  value = signal<TreeSelectValue>(null);
  calls: string[] = [];
  pending = new Map<string, ReturnType<typeof deferred<TreeNode[]>>>();
  loader = signal<TreeChildrenLoader | null>((node: TreeNode) => {
    this.calls.push(node.key);
    const d = deferred<TreeNode[]>();
    this.pending.set(node.key, d);
    return d.promise;
  });
}

describe('TreeSelect phase 2: loadChildren and summary value', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const button = () => el.querySelector<HTMLButtonElement>('button.control')!;
  const tree = () => el.querySelector<HTMLElement>('[role="tree"]')!;
  const items = () => Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]'));
  const labels = () => items().map(i => i.querySelector('.node-label')!.textContent!.trim());
  const item = (label: string) => items().find(i => i.querySelector('.node-label')!.textContent!.trim() === label)!;
  const live = () => el.querySelector('[role="status"]')!.textContent!.trim();
  const shown = () => el.querySelector('.control .value')!.textContent!.replace(/\s+/g, ' ').trim();
  const flush = async () => { await new Promise(r => setTimeout(r)); await fixture.whenStable(); };
  const openPanel = async () => { button().click(); await flush(); };
  const twisty = async (label: string) => { item(label).querySelector<HTMLElement>('.twisty')!.click(); await flush(); };
  const check = async (label: string) => { item(label).click(); await flush(); };

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

  describe('loadChildren', () => {
    it('a leaf:false node shows the expand arrow and loads its children when opened (busy while loading)', async () => {
      await openPanel();
      expect(item('São Paulo').getAttribute('aria-expanded')).toBe('false');
      expect(host.calls).toEqual([]); // nada é buscado antes de abrir

      tree().focus();
      tree().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await flush();
      expect(host.calls).toEqual(['sp']);
      expect(item('São Paulo').getAttribute('aria-busy')).toBe('true');
      expect(item('São Paulo').querySelector('.twisty.is-loading')).not.toBeNull();
      expect(live()).toBe('São Paulo: Carregando…');

      host.pending.get('sp')!.resolve(SP);
      await flush();
      expect(labels()).toEqual(['São Paulo', 'Campinas', 'Santos', 'Bahia', 'Rio de Janeiro']);
      expect(item('São Paulo').getAttribute('aria-busy')).toBeNull();
      expect(item('Campinas').getAttribute('aria-level')).toBe('2');
      expect(live()).toBe('');

      // escolher um filho carregado mostra o caminho completo
      await check('Campinas');
      expect(host.value()).toBe('campinas');
      expect(shown()).toBe('São Paulo › Campinas');

      // fechar e abrir de novo não busca outra vez
      await openPanel();
      await twisty('São Paulo');
      await twisty('São Paulo');
      expect(host.calls).toEqual(['sp']);
    });

    it('on error: closes the node, shows and announces the message; opening again retries', async () => {
      await openPanel();
      await twisty('Bahia');
      host.pending.get('ba')!.reject(new Error('500'));
      await flush();

      expect(item('Bahia').getAttribute('aria-expanded')).toBe('false');
      expect(item('Bahia').querySelector('.node-error')!.textContent).toContain('Não foi possível carregar');
      expect(live()).toContain('Bahia: Não foi possível carregar');

      await twisty('Bahia');
      expect(host.calls).toEqual(['ba', 'ba']);
      expect(item('Bahia').querySelector('.node-error')).toBeNull();
      host.pending.get('ba')!.resolve([{ key: 'salvador', label: 'Salvador' }]);
      await flush();
      expect(labels()).toContain('Salvador');
    });

    it('accepts an Observable; an empty result turns the node into a leaf', async () => {
      host.loader.set(node => of(node.key === 'sp' ? SP : []));
      await fixture.whenStable();
      await openPanel();
      await twisty('São Paulo');
      expect(labels()).toContain('Santos');

      await twisty('Bahia');
      expect(item('Bahia').getAttribute('aria-expanded')).toBeNull(); // virou folha
    });

    it('a new [nodes] tree discards what was loaded and ignores answers to old requests', async () => {
      await openPanel();
      await twisty('São Paulo');
      host.nodes.set([...LAZY]);
      await fixture.whenStable();
      host.pending.get('sp')!.resolve(SP);
      await flush();
      expect(labels()).not.toContain('Campinas');
    });
  });

  describe('checkbox with groups not loaded yet', () => {
    beforeEach(async () => { host.mode.set('checkbox'); await fixture.whenStable(); });

    it('a group can be checked without loading it; once loaded, its children come checked', async () => {
      await openPanel();
      await check('São Paulo');
      expect(host.calls).toEqual([]); // marcar não busca nada
      expect(host.value()).toEqual(['sp']);
      expect(item('São Paulo').getAttribute('aria-checked')).toBe('true');

      await twisty('São Paulo');
      host.pending.get('sp')!.resolve(SP);
      await flush();
      expect(item('Campinas').getAttribute('aria-checked')).toBe('true');
      expect(item('Santos').getAttribute('aria-checked')).toBe('true');
      expect(item('São Paulo').getAttribute('aria-checked')).toBe('true');

      await check('Campinas'); // desmarca uma: o valor passa a listar as folhas
      expect(host.value()).toEqual(['santos']);
      expect(item('São Paulo').getAttribute('aria-checked')).toBe('mixed');
    });
  });

  describe('valueMode="summary"', () => {
    beforeEach(async () => {
      host.mode.set('checkbox');
      host.valueMode.set('summary');
      host.loader.set(node => of(node.key === 'sp' ? SP : [{ key: 'salvador', label: 'Salvador' }]));
      await fixture.whenStable();
      await openPanel();
      await twisty('São Paulo');
    });

    it('a complete group becomes one key (and one chip); partial groups list their leaves', async () => {
      await check('São Paulo');
      expect(host.value()).toEqual(['sp']);
      expect(shown()).toBe('São Paulo');

      await check('Santos');
      expect(host.value()).toEqual(['campinas']);

      await check('Santos');
      expect(host.value()).toEqual(['sp']);
    });

    it('a group with a disabled leaf that is not checked is not summarized', async () => {
      await check('Rio de Janeiro'); // Niterói desabilitada fica de fora
      expect(host.value()).toEqual(['petropolis']);
      expect(item('Rio de Janeiro').getAttribute('aria-checked')).toBe('true');
    });

    it('a group key coming from outside checks the whole group', async () => {
      host.value.set(['sp', 'ba']);
      await fixture.whenStable();
      expect(item('Campinas').getAttribute('aria-checked')).toBe('true');
      expect(item('Santos').getAttribute('aria-checked')).toBe('true');
      expect(item('Bahia').getAttribute('aria-checked')).toBe('true'); // ainda não carregada: unidade
      expect(shown()).toBe('São Paulo , Bahia'.replace(' ,', ','));
    });
  });
});
