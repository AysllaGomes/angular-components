/** Tipos públicos da Tabela (colunas, ações por linha e ações em massa). */

export type Cell = 'text' | 'chip' | 'custom';

export type Align = 'left' | 'center' | 'right';

export interface ChipMapEntry {
  label: string;
  /** nome da variação de cor (defina no CSS): 'teal' | 'orange' | 'success' | 'warning' | etc */
  variant?: string;
}

export interface ColumnDef<T = any> {
  /** chave do objeto (ex.: 'nome', 'tipo', ...) */
  key: keyof T | string;
  header: string;
  type?: Cell;
  width?: string;
  align?: Align;
  chipMap?: Record<string, ChipMapEntry>;
  /**
   * Prioridade quando falta largura: 1 (padrão) nunca some; números maiores somem
   * primeiro e o valor vai para a linha de detalhes ("Mostrar detalhes").
   */
  priority?: number;
}

export type SortDir = 'asc' | 'desc';

export type ActionKind = 'edit' | 'delete' | 'view' | 'download';

export interface TableAction<T = any> {
  kind: ActionKind;                     // 'edit', 'delete', 'view', 'download'...
  label?: string;                       // nome curto (dica e leitor de tela); padrão: labels.table.action[kind] (provideUiLabels)
  ariaLabel?: string;                   // nome mais específico (ex.: "Editar Ana"); vence o label
  visible?: (row: T, index: number) => boolean;   // exibir por linha?
  disabled?: (row: T, index: number) => boolean;  // desabilitar por linha? (continua focável, com aria-disabled)
  disabledReason?: (row: T, index: number) => string | null | undefined; // motivo, mostrado na dica
  // opcional: se quiser trocar por um asset específico
  iconUrl?: string;                     // se fornecido, usa <img>, senão ícone inline (currentColor)
}

/**
 * O que a barra de ações em massa mostra sem seleção:
 * - `'space'`: nada, mas guarda o espaço (a tabela não pula ao selecionar);
 * - `'hint'`: o texto `noSelectionLabel` (também guarda o espaço);
 * - `'hidden'`: a barra só aparece com seleção (a tabela desce ao marcar a primeira linha).
 */
export type TableBulkBarIdle = 'space' | 'hint' | 'hidden';

/**
 * Ação em massa: um botão com texto na barra que aparece ao selecionar linhas.
 * Recebe as **chaves** selecionadas (com `rowKey`) ou os índices em `data` (sem `rowKey`):
 * com seleção entre páginas, as linhas de outras páginas não estão em `data`.
 */
export interface TableBulkAction<K = any> {
  type: string;                                       // identificador emitido em (bulkAction)
  label: string;                                      // texto do botão
  danger?: boolean;                                   // ação destrutiva (ex.: Excluir), em vermelho
  disabled?: (keys: K[]) => boolean;                  // continua focável (aria-disabled)
  disabledReason?: (keys: K[]) => string | null | undefined; // motivo, mostrado na dica
}

/** `rowKey`: o nome de uma propriedade da linha ou uma função que devolve a chave dela */
export type TableRowKey<T> = keyof T | ((row: T, index: number) => unknown);

/**
 * Tipo das chaves da seleção (`selected`, `selectedChange`, `bulkAction`), deduzido do `rowKey`:
 * o tipo da propriedade (`rowKey="id"` → `T['id']`), o retorno da função, ou `number`
 * (o índice em `data`) quando não há `rowKey`.
 */
export type TableKey<T, R> =
  [R] extends [never] ? number
  : R extends keyof T ? T[R]
  : R extends (row: T, index: number) => infer K ? K
  : unknown;
