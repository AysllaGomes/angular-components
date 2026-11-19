import { TreeNode } from '../../model/interface/tree-select/tree-node.interface';

import { checkState, filterTree, indexTree, toggleLeaves, visibleLeaves } from './tree-utils';

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
  { key: 'ar', label: 'Argentina', disabled: true, children: [
    { key: 'cordoba', label: 'Córdoba' },
  ] },
];

describe('tree-utils', () => {
  const index = indexTree(TREE);

  it('indexes levels, parents, paths and leaves in display order', () => {
    expect(index.get('campinas')).toMatchObject({ level: 3, parent: 'sp', path: ['Brasil', 'São Paulo', 'Campinas'], isLeaf: true });
    expect(index.get('br')!.allLeaves).toEqual(['campinas', 'santos', 'niteroi', 'petropolis']);
    // folha desabilitada não é marcável
    expect(index.get('br')!.leaves).toEqual(['campinas', 'santos', 'petropolis']);
  });

  it('disabled propagates to the whole subtree', () => {
    expect(index.get('cordoba')!.disabled).toBe(true);
    expect(index.get('ar')!.leaves).toEqual([]);
  });

  it('group state: unchecked, mixed, checked (ignoring disabled leaves)', () => {
    const sp = index.get('sp')!;
    const rj = index.get('rj')!;
    expect(checkState(sp, new Set(), index)).toBe('unchecked');
    expect(checkState(sp, new Set(['campinas']), index)).toBe('mixed');
    expect(checkState(sp, new Set(['campinas', 'santos']), index)).toBe('checked');
    // rj: niteroi desabilitado; só petropolis já completa o grupo
    expect(checkState(rj, new Set(['petropolis']), index)).toBe('checked');
  });

  it('a disabled leaf selected from outside counts toward the group', () => {
    const rj = index.get('rj')!;
    expect(checkState(rj, new Set(['niteroi']), index)).toBe('mixed');
    expect(checkState(rj, new Set(['niteroi', 'petropolis']), index)).toBe('checked');
  });

  it('toggleLeaves: partial completes, full clears', () => {
    expect([...toggleLeaves(['campinas', 'santos'], new Set(['campinas']))].sort()).toEqual(['campinas', 'santos']);
    expect([...toggleLeaves(['campinas', 'santos'], new Set(['campinas', 'santos', 'petropolis']))]).toEqual(['petropolis']);
  });

  it('filter keeps matches with their ancestors, and a matching group keeps its subtree', () => {
    const byCity = filterTree(TREE, 'petro');
    expect(byCity.roots.map(n => n.key)).toEqual(['br']);
    expect(byCity.children.get('br')!.map(n => n.key)).toEqual(['rj']);
    expect(byCity.children.get('rj')!.map(n => n.key)).toEqual(['petropolis']);

    const byGroup = filterTree(TREE, 'sao paulo'); // sem acento
    expect(byGroup.children.get('sp')!.map(n => n.key)).toEqual(['campinas', 'santos']);
  });

  it('visibleLeaves: only the leaves shown by the filter', () => {
    const f = filterTree(TREE, 'santos');
    expect(visibleLeaves('br', f, index)).toEqual(['santos']);
  });
});
