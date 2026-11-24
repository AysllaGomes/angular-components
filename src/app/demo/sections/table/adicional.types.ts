/** Dados de exemplo da demo da Tabela (não fazem parte da biblioteca). */
import { SortDir } from '../../../shared/components/table/table.types';

export type Tipo = 'Correntista' | 'Não correntista';

export interface AdicionalRow {
  nome: string;
  tipo: Tipo;
  documento: string;
  limite: string;
  nomeImpresso: string;
}

export interface SortState { key: keyof AdicionalRow | string; dir: SortDir }
