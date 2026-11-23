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
