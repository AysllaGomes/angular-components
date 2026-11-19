import { CheckState } from '../checkbox/checkbox-mark.component';

import { TreeNode } from '../../model/interface/tree-select/tree-node.interface';

/** informações pré-calculadas de cada nó (índice da árvore) */
export interface NodeInfo<T = unknown> {
  node: TreeNode<T>;
  /** key do pai (`null` na raiz) */
  parent: string | null;
  /** profundidade, a partir de 1 (vai no `aria-level`) */
  level: number;
  /** rótulos da raiz até o nó, inclusive */
  path: string[];
  isLeaf: boolean;
  /** filhos ainda não carregados (`leaf: false` sem `children`) */
  pending: boolean;
  /**
   * unidade de marcação no modo checkbox: folha, ou grupo ainda não carregado
   * (marcar "Bahia" sem ter as cidades). É o que entra em `leaves`/`allLeaves`.
   */
  unit: boolean;
  /** desabilitado por ele mesmo ou por um ancestral */
  disabled: boolean;
  /** unidade que pode ser marcada no modo checkbox (habilitada e `selectable !== false`) */
  checkable: boolean;
  /** unidades marcáveis na subárvore (a própria, se for unidade) */
  leaves: string[];
  /** todas as unidades da subárvore, inclusive as não marcáveis */
  allLeaves: string[];
  /** número sequencial, para ids no DOM (keys podem ter qualquer caractere) */
  num: number;
}

export type TreeIndex<T = unknown> = Map<string, NodeInfo<T>>;

/** sem acento e sem caixa, para filtro e typeahead */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Indexa a árvore inteira (ordem de exibição). Keys repetidas: vale a primeira. */
export function indexTree<T>(nodes: TreeNode<T>[]): TreeIndex<T> {
  const index: TreeIndex<T> = new Map();
  let num = 0;

  const walk = (list: TreeNode<T>[], parent: string | null, level: number, path: string[], inheritedDisabled: boolean) => {
    const leaves: string[] = [];
    const allLeaves: string[] = [];
    for (const node of list) {
      if (index.has(node.key)) continue;
      const disabled = inheritedDisabled || !!node.disabled;
      const pending = !node.children?.length && node.leaf === false;
      const isLeaf = !node.children?.length && !pending;
      const unit = isLeaf || pending;
      const info: NodeInfo<T> = {
        node, parent, level, path: [...path, node.label], isLeaf, pending, unit, disabled,
        checkable: unit && !disabled && node.selectable !== false,
        leaves: [], allLeaves: [], num: num++,
      };
      index.set(node.key, info);
      if (unit) {
        info.allLeaves = [node.key];
        info.leaves = info.checkable ? [node.key] : [];
      } else {
        const sub = walk(node.children!, node.key, level + 1, info.path, disabled);
        info.leaves = sub.leaves;
        info.allLeaves = sub.allLeaves;
      }
      leaves.push(...info.leaves);
      allLeaves.push(...info.allLeaves);
    }
    return { leaves, allLeaves };
  };

  walk(nodes, null, 1, [], false);
  return index;
}

/**
 * Estado da caixa de um nó, dado o conjunto de folhas marcadas.
 * Folhas não marcáveis só contam se já estiverem marcadas (ex.: valor vindo de fora),
 * então um grupo com uma folha desabilitada ainda pode ficar "marcado" por completo.
 */
export function checkState<T>(info: NodeInfo<T>, selected: ReadonlySet<string>, index: TreeIndex<T>): CheckState {
  if (info.unit) return selected.has(info.node.key) ? 'checked' : 'unchecked';
  let on = 0;
  let relevant = info.leaves.length;
  for (const k of info.allLeaves) {
    if (!selected.has(k)) continue;
    on++;
    if (!index.get(k)!.checkable) relevant++;
  }
  if (on === 0) return 'unchecked';
  return on >= relevant ? 'checked' : 'mixed';
}

/**
 * Marca/desmarca um nó (folha ou grupo) e devolve o novo conjunto.
 * Grupo: se todas as folhas-alvo já estão marcadas, desmarca todas; senão, marca todas
 * (parcial → completa o resto). `targets` = folhas marcáveis consideradas (com filtro,
 * só as visíveis).
 */
export function toggleLeaves(targets: string[], selected: ReadonlySet<string>): Set<string> {
  const next = new Set(selected);
  const allOn = targets.length > 0 && targets.every(k => next.has(k));
  for (const k of targets) {
    if (allOn) next.delete(k); else next.add(k);
  }
  return next;
}

/** resultado do filtro: raízes visíveis e filhos visíveis de cada nó */
export interface FilteredTree<T = unknown> {
  roots: TreeNode<T>[];
  children: Map<string, TreeNode<T>[]>;
}

/**
 * Filtra pelo rótulo (sem acento/caixa). Um nó aparece se ele combina (com toda a
 * subárvore) ou se algum descendente combina (só com os ramos que levam até ele).
 */
export function filterTree<T>(nodes: TreeNode<T>[], query: string): FilteredTree<T> {
  const q = normalize(query.trim());
  const children = new Map<string, TreeNode<T>[]>();

  const keepAll = (node: TreeNode<T>) => {
    const kids = node.children ?? [];
    children.set(node.key, kids);
    kids.forEach(keepAll);
  };

  const visit = (list: TreeNode<T>[]): TreeNode<T>[] => {
    const out: TreeNode<T>[] = [];
    for (const node of list) {
      if (normalize(node.label).includes(q)) {
        keepAll(node);
        out.push(node);
        continue;
      }
      const kids = visit(node.children ?? []);
      if (kids.length) {
        children.set(node.key, kids);
        out.push(node);
      }
    }
    return out;
  };

  return { roots: visit(nodes), children };
}

/** folhas marcáveis visíveis na subárvore filtrada de um nó */
export function visibleLeaves<T>(key: string, filtered: FilteredTree<T>, index: TreeIndex<T>): string[] {
  const out: string[] = [];
  const walk = (k: string) => {
    const info = index.get(k);
    if (!info) return;
    if (info.unit) { if (info.checkable) out.push(k); return; }
    for (const child of filtered.children.get(k) ?? []) walk(child.key);
  };
  walk(key);
  return out;
}

/**
 * Conjunto de unidades marcadas a partir do valor: key de grupo (valor resumido,
 * ou grupo marcado antes de carregar) vira todas as unidades dele. Keys que não
 * estão na árvore são mantidas.
 */
export function expandSelection<T>(keys: readonly string[], index: TreeIndex<T>): Set<string> {
  const out = new Set<string>();
  for (const k of keys) {
    const info = index.get(k);
    if (info && !info.unit) info.allLeaves.forEach(u => out.add(u));
    else out.add(k);
  }
  return out;
}

/** valor `leaves`: unidades marcadas, na ordem da árvore */
export function leafValue<T>(selected: ReadonlySet<string>, index: TreeIndex<T>): string[] {
  const out: string[] = [];
  for (const [key, info] of index) if (info.unit && selected.has(key)) out.push(key);
  return out;
}

/**
 * valor `summary`: grupo com **todas** as unidades marcadas (inclusive as desabilitadas)
 * vira a key do grupo e os filhos não aparecem; o resto segue como em `leaves`.
 */
export function summaryValue<T>(nodes: TreeNode<T>[], selected: ReadonlySet<string>, index: TreeIndex<T>): string[] {
  const out: string[] = [];
  const visit = (list: TreeNode<T>[]) => {
    for (const node of list) {
      const info = index.get(node.key);
      if (!info || info.node !== node) continue; // key repetida: vale a primeira
      if (info.unit) { if (selected.has(node.key)) out.push(node.key); continue; }
      if (info.allLeaves.length && info.allLeaves.every(k => selected.has(k))) out.push(node.key);
      else visit(node.children ?? []);
    }
  };
  visit(nodes);
  return out;
}

/** árvore com os filhos carregados sob demanda já no lugar (sem alterar a original) */
export function attachChildren<T>(nodes: TreeNode<T>[], loaded: ReadonlyMap<string, TreeNode<T>[]>): TreeNode<T>[] {
  if (!loaded.size) return nodes;
  const walk = (list: TreeNode<T>[]): TreeNode<T>[] => list.map(node => {
    const kids = loaded.get(node.key);
    if (kids && !node.children?.length) return { ...node, children: walk(kids), leaf: kids.length > 0 ? false : true };
    if (node.children?.length) return { ...node, children: walk(node.children) };
    return node;
  });
  return walk(nodes);
}
