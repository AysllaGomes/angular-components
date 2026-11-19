import { Dict } from '../../model/type/dict.type';

export const TREE_SELECT: Dict = {
  'section.treeselect.title': { pt: 'TreeSelect', en: 'TreeSelect' },
  'section.treeselect.lead': {
    pt: 'Select cujas opções formam uma árvore: escolha um nó ou marque grupos inteiros. Teclado no padrão WAI-ARIA de árvore.',
    en: 'A select whose options form a tree: pick one node or check whole groups. Keyboard follows the WAI-ARIA tree pattern.'
  },
  'nav.treeselect': { pt: 'TreeSelect', en: 'TreeSelect' },

  // single
  'treeselect.demo.single.title': { pt: 'Seleção única (caminho no campo)', en: 'Single selection (path in the field)' },
  'treeselect.demo.single.label': { pt: 'Cidade', en: 'City' },
  'treeselect.demo.single.placeholder': { pt: 'Escolha um local', en: 'Choose a place' },
  'treeselect.demo.single.hint': {
    pt: 'Países e estados também podem ser escolhidos; com leafOnly, só as cidades.',
    en: 'Countries and states can be chosen too; with leafOnly, only cities.'
  },
  'treeselect.demo.leafonly.title': { pt: 'Só folhas (leafOnly)', en: 'Leaves only (leafOnly)' },

  // checkbox
  'treeselect.demo.checkbox.title': { pt: 'Vários com checkbox e filtro', en: 'Multiple with checkboxes and filter' },
  'treeselect.demo.checkbox.label': { pt: 'Permissões', en: 'Permissions' },
  'treeselect.demo.checkbox.placeholder': { pt: 'Nenhuma permissão', en: 'No permissions' },
  'treeselect.demo.checkbox.hint': {
    pt: 'Marcar um módulo marca as ações dele; o valor são só as ações (folhas).',
    en: 'Checking a module checks its actions; the value holds only the actions (leaves).'
  },

  'treeselect.demo.lazy.title': { pt: 'Carregando sob demanda (loadChildren)', en: 'Loading on demand (loadChildren)' },
  'treeselect.demo.lazy.label': { pt: 'Cidades atendidas', en: 'Served cities' },
  'treeselect.demo.lazy.placeholder': { pt: 'Nenhuma cidade', en: 'No cities' },
  'treeselect.demo.lazy.hint': {
    pt: 'As cidades vêm de uma API simulada ao abrir o estado. Dá para marcar um estado sem abrir; a Bahia falha na primeira vez.',
    en: 'Cities come from a simulated API when a state is opened. A state can be checked without opening it; Bahia fails the first time.'
  },
  'treeselect.demo.summary.title': { pt: 'Valor resumido (valueMode="summary")', en: 'Summarized value (valueMode="summary")' },
  'treeselect.demo.summary.hint': {
    pt: 'Módulo com todas as ações marcadas vira uma key só (ex.: "finance").',
    en: 'A module with every action checked becomes a single key (e.g. "finance").'
  },
  'treeselect.loading': { pt: 'Carregando…', en: 'Loading…' },
  'treeselect.loadError': { pt: 'Não foi possível carregar. Abra de novo para tentar.', en: 'Could not load. Open it again to retry.' },

  'treeselect.demo.value': { pt: 'Valor: {{v}}', en: 'Value: {{v}}' },
  'treeselect.filter': { pt: 'Filtrar…', en: 'Filter…' },
  'treeselect.empty': { pt: 'Nenhum item encontrado', en: 'No items found' },

  // nós: permissões
  'perm.sales': { pt: 'Vendas', en: 'Sales' },
  'perm.sales.view': { pt: 'Ver pedidos', en: 'View orders' },
  'perm.sales.create': { pt: 'Criar pedidos', en: 'Create orders' },
  'perm.sales.refund': { pt: 'Estornar (só gestores)', en: 'Refund (managers only)' },
  'perm.finance': { pt: 'Financeiro', en: 'Finance' },
  'perm.finance.reports': { pt: 'Relatórios', en: 'Reports' },
  'perm.finance.export': { pt: 'Exportar dados', en: 'Export data' },
  'perm.admin': { pt: 'Administração', en: 'Administration' },
  'perm.admin.users': { pt: 'Usuários', en: 'Users' },
  'perm.admin.users.invite': { pt: 'Convidar', en: 'Invite' },
  'perm.admin.users.remove': { pt: 'Remover', en: 'Remove' },
  'perm.admin.audit': { pt: 'Ver auditoria', en: 'View audit log' },
};
