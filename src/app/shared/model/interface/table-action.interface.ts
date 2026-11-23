import { ActionKind } from '../type/action-kind.type';

export interface TableAction<T = any> {
  kind: ActionKind;                     // 'edit', 'delete', 'view', 'download'...
  label?: string;                       // nome curto (dica e leitor de tela); padrão em PT pelo kind
  ariaLabel?: string;                   // nome mais específico (ex.: "Editar Ana"); vence o label
  visible?: (row: T, index: number) => boolean;   // exibir por linha?
  disabled?: (row: T, index: number) => boolean;  // desabilitar por linha? (continua focável, com aria-disabled)
  disabledReason?: (row: T, index: number) => string | null | undefined; // motivo, mostrado na dica
  // opcional: se quiser trocar por um asset específico
  iconUrl?: string;                     // se fornecido, usa <img>, senão ícone inline (currentColor)
}
