import { Dict } from '../../model/type/dict.type';

export const TABLE: Dict = {
  // seção (título/lead já estão em sections.ts)
  'section.table.title': { pt: 'Tabela', en: 'Table' },
  'section.table.lead':  {
    pt: 'Tabela personalizável com seleção, chips e ações.',
    en: 'Customizable table with selection, chips and actions.'
  },

  // toolbar da demo
  'table.toolbar.simulate':         { pt: 'Simular loading (1.5s)', en: 'Simulate loading (1.5s)' },
  'table.toolbar.simulate.loading': { pt: 'Carregando…',            en: 'Loading…' },
  'table.toolbar.simulateError':    { pt: 'Simular erro',           en: 'Simulate error' },
  'table.toolbar.idle':             { pt: 'Barra sem seleção: {{mode}}', en: 'Bar without selection: {{mode}}' },
  'table.toolbar.idle.space':       { pt: 'espaço',                 en: 'space' },
  'table.toolbar.idle.hint':        { pt: 'texto',                  en: 'text' },
  'table.toolbar.idle.hidden':      { pt: 'escondida',              en: 'hidden' },
  'table.toolbar.restore':          { pt: 'Restaurar linhas ({{n}})', en: 'Restore rows ({{n}})' },
  'table.toolbar.toggleEmpty.show': { pt: 'Mostrar vazio',          en: 'Show empty' },
  'table.toolbar.toggleEmpty.hide': { pt: 'Mostrar dados',          en: 'Show data' },

  // mensagens/labels
  'table.empty': { pt: 'Sem registros para exibir', en: 'No records to display' },
  'table.error.load': {
    pt: 'Não foi possível carregar os adicionais. Verifique a conexão e tente de novo.',
    en: 'Could not load the additional cardholders. Check your connection and try again.'
  },
  'table.retry': { pt: 'Tentar novamente', en: 'Try again' },
  'table.bulk.label': { pt: 'Ações em massa', en: 'Bulk actions' },
  'table.bulk.count.one': { pt: '{{n}} selecionado', en: '{{n}} selected' },
  'table.bulk.count.other': { pt: '{{n}} selecionados', en: '{{n}} selected' },
  'table.bulk.none': { pt: 'Nenhuma linha selecionada', en: 'No rows selected' },
  'table.bulk.clear': { pt: 'Limpar seleção', en: 'Clear selection' },
  'table.bulk.export': { pt: 'Exportar', en: 'Export' },
  'table.bulk.delete': { pt: 'Excluir selecionados', en: 'Delete selected' },
  'table.bulk.delete.blocked': {
    pt: 'a seleção tem correntistas, que só podem ser removidos pela agência',
    en: 'the selection has account holders, who can only be removed by the branch'
  },
  'table.actions': { pt: 'Ações', en: 'Actions' },
  'table.action.edit': { pt: 'Editar', en: 'Edit' },
  'table.action.delete': { pt: 'Excluir', en: 'Delete' },
  'table.action.delete.blocked': { pt: 'correntistas só podem ser removidos pela agência', en: 'account holders can only be removed by the branch' },

  // (opcional) cabeçalhos das colunas
  'table.col.nome':         { pt: 'Nome do adicional',  en: 'Additional name' },
  'table.col.tipo':         { pt: 'Tipo de adicional',  en: 'Additional type' },
  'table.col.documento':    { pt: 'Documento',          en: 'Document' },
  'table.col.limite':       { pt: 'Limite atribuído',   en: 'Assigned limit' },
  'table.col.nomeImpresso': { pt: 'Nome impresso',      en: 'Printed name' },
};
