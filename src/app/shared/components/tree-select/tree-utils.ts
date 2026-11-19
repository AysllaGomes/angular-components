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
  /** desabilitado por ele mesmo ou por um ancestral */
  disabled: boolean;
  /** folha que pode ser marcada no modo checkbox (habilitada e `selectable !== false`) */
  checkable: boolean;
  /** folhas marcáveis na subárvore (a própria, se for folha) */
  leaves: string[];
  /** todas as folhas da subárvore, inclusive as não marcáveis */
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
      const isLeaf = !node.children?.length;
      const info: NodeInfo<T> = {
        node, parent, level, path: [...path, node.label], isLeaf, disabled,
        checkable: isLeaf && !disabled && node.selectable !== false,
        leaves: [], allLeaves: [], num: num++,
      };
      index.set(node.key, info);
      if (isLeaf) {
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
  if (info.isLeaf) return selected.has(info.node.key) ? 'checked' : 'unchecked';
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
    if (info.isLeaf) { if (info.checkable) out.push(k); return; }
    for (const child of filtered.children.get(k) ?? []) walk(child.key);
  };
  walk(key);
  return out;
}
