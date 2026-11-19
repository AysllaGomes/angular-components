/** Nó da árvore do `app-tree-select`. */
export interface TreeNode<T = unknown> {
  /** identificador único na árvore inteira; é o que vai no valor */
  key: string;
  label: string;
  /** dado extra opcional, livre (não entra no valor) */
  value?: T;
  children?: TreeNode<T>[];
  /**
   * `false` (sem `children`): os filhos ainda vão ser carregados pelo `loadChildren`
   * do `app-tree-select`. Até lá, no modo `checkbox`, o nó é marcado como uma unidade.
   */
  leaf?: boolean;
  /** desabilita o nó e toda a subárvore */
  disabled?: boolean;
  /**
   * `false`: o nó não pode ser escolhido (só agrupa/navega). No modo `checkbox`,
   * uma folha com `selectable: false` não tem caixa e não entra no "marcar grupo".
   */
  selectable?: boolean;
}

/** `single`: escolhe um nó (valor = key). `checkbox`: marca vários (valor = keys das folhas). */
export type TreeSelectionMode = 'single' | 'checkbox';

/**
 * Formato do valor no modo `checkbox`:
 * - `leaves`: keys das folhas marcadas;
 * - `summary`: grupo com todas as folhas marcadas vira a key do grupo (resumido).
 */
export type TreeValueMode = 'leaves' | 'summary';
