/** Nó da árvore do `app-tree-select`. */
export interface TreeNode<T = unknown> {
  /** identificador único na árvore inteira; é o que vai no valor */
  key: string;
  label: string;
  /** dado extra opcional, livre (não entra no valor) */
  value?: T;
  children?: TreeNode<T>[];
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
