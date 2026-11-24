import { Dict } from '../i18n.types';

export const MENU: Dict = {
  'section.menu.title': { pt: 'Menu', en: 'Menu' },
  'section.menu.lead': {
    pt: 'Ações atrás de um botão: setas, Home/End, busca pela inicial, Esc e Tab fecham, e o foco volta ao botão antes da ação.',
    en: 'Actions behind a button: arrows, Home/End, type-to-find, Esc and Tab close it, and focus goes back to the button before the action runs.'
  },

  'menu.demo.actions.title': { pt: 'Ações do pedido', en: 'Order actions' },
  'menu.demo.actions.hint': {
    pt: '"Excluir" abre uma confirmação: ao fechá-la, o foco volta para o botão "Ações".',
    en: '"Delete" opens a confirmation: when it closes, focus goes back to the "Actions" button.'
  },
  'menu.demo.actions': { pt: 'Ações', en: 'Actions' },
  'menu.demo.edit': { pt: 'Editar', en: 'Edit' },
  'menu.demo.duplicate': { pt: 'Duplicar', en: 'Duplicate' },
  'menu.demo.archive': { pt: 'Arquivar', en: 'Archive' },
  'menu.demo.move': { pt: 'Mover (sem permissão)', en: 'Move (no permission)' },
  'menu.demo.delete': { pt: 'Excluir', en: 'Delete' },
  'menu.demo.done': { pt: 'Escolhido: {{action}}', en: 'Chosen: {{action}}' },
  'menu.demo.confirm.title': { pt: 'Excluir o pedido?', en: 'Delete the order?' },
  'menu.demo.confirm.body': { pt: 'Essa ação não pode ser desfeita.', en: 'This cannot be undone.' },
  'menu.demo.confirm.yes': { pt: 'Excluir', en: 'Delete' },
  'menu.demo.confirm.no': { pt: 'Cancelar', en: 'Cancel' },
  'menu.demo.deleted': { pt: 'Pedido excluído.', en: 'Order deleted.' },

  'menu.demo.rows.title': { pt: 'Um menu por linha, numa lista com rolagem', en: 'One menu per row, in a scrolling list' },
  'menu.demo.rows.hint': {
    pt: 'O menu flutua por cima da lista: não é cortado pela rolagem e vira para cima perto da borda.',
    en: 'The menu floats above the list: it is not clipped by the scroll and flips up near the edge.'
  },
  'menu.demo.rows.label': { pt: 'Pedidos recentes', en: 'Recent orders' },
  'menu.demo.row.more': { pt: 'Mais ações do pedido {{n}}', en: 'More actions for order {{n}}' },
  'menu.demo.row.menu': { pt: 'Ações do pedido {{n}}', en: 'Actions for order {{n}}' },
  'menu.demo.row.open': { pt: 'Abrir', en: 'Open' },
  'menu.demo.row.copy': { pt: 'Copiar número', en: 'Copy number' },
  'menu.demo.row.cancel': { pt: 'Cancelar pedido', en: 'Cancel order' },
};
