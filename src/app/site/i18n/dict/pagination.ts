import { Dict } from '../i18n.types';

export const PAGINATION: Dict = {
  // seção
  'section.pagination.title': { pt: 'Paginação', en: 'Pagination' },
  'section.pagination.lead':  {
    pt: 'Componente independente, sem dependência da Tabela. Mostra botões somente quando há mais itens que o pageSize.',
    en: 'Standalone component, independent from the Table. Only shows controls when there are more items than pageSize.'
  },

  // rótulos/legendas da demo
  'pagination.itemsPerPage': { pt: 'Itens por página', en: 'Items per page' },
  'pagination.range':       { pt: 'Mostrando {{start}}–{{end}} de {{total}}',
    en: 'Showing {{start}}–{{end}} of {{total}}' },

  'pagination.nav.demo':    { pt: 'Paginação de exemplo', en: 'Example pagination' },
  'pagination.nav.compact': { pt: 'Paginação compacta', en: 'Compact pagination' },
  'pagination.nav.table':   { pt: 'Paginação da tabela', en: 'Table pagination' },

  // demo do modo compacto
  'pagination.demo.compact.title': { pt: 'Compacto', en: 'Compact' },
  'pagination.demo.compact.note':  {
    pt: 'Com compact="auto" (usado acima), a paginação vira compacta só em telas de até 420px.',
    en: 'With compact="auto" (used above), the pagination turns compact only on screens up to 420px.'
  },
};
