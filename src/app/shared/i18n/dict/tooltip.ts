import { Dict } from '../../model/type/dict.type';

export const TOOLTIP: Dict = {
  'nav.tooltip': { pt: 'Tooltip', en: 'Tooltip' },

  'section.tooltip.title': { pt: 'Tooltip', en: 'Tooltip' },
  'section.tooltip.lead': {
    pt: 'Dica curta ao passar o mouse ou focar pelo teclado. Esc fecha; dá para levar o mouse até o balão sem ele sumir.',
    en: 'Short hint on hover or keyboard focus. Esc closes it; you can move the pointer onto the bubble without it disappearing.'
  },

  // botões só com ícone
  'tooltip.demo.icons.title': { pt: 'Botões só com ícone (a dica é o nome)', en: 'Icon-only buttons (the hint is the name)' },
  'tooltip.demo.icons.hint': {
    pt: 'Com tooltipAsLabel o leitor de tela anuncia "Editar, botão". Passando de um botão para o outro, a dica troca sem espera.',
    en: 'With tooltipAsLabel screen readers announce "Edit, button". Moving from one button to the next switches the hint without delay.'
  },
  'tooltip.demo.toolbar': { pt: 'Ações do documento', en: 'Document actions' },
  'tooltip.edit': { pt: 'Editar', en: 'Edit' },
  'tooltip.copy': { pt: 'Copiar link', en: 'Copy link' },
  'tooltip.delete': { pt: 'Excluir', en: 'Delete' },

  // posições
  'tooltip.demo.positions.title': { pt: 'Posições', en: 'Positions' },
  'tooltip.demo.positions.hint': {
    pt: 'Sem espaço no lado pedido (ex.: perto da borda da janela), o balão vira para o lado oposto.',
    en: 'Without room on the requested side (e.g. near the window edge), the bubble flips to the opposite side.'
  },
  'tooltip.pos.top': { pt: 'Em cima', en: 'Top' },
  'tooltip.pos.right': { pt: 'À direita', en: 'Right' },
  'tooltip.pos.bottom': { pt: 'Embaixo', en: 'Bottom' },
  'tooltip.pos.left': { pt: 'À esquerda', en: 'Left' },
  'tooltip.pos.text': { pt: 'Balão {{side}}', en: 'Bubble on the {{side}}' },
  'tooltip.side.top': { pt: 'em cima', en: 'top' },
  'tooltip.side.right': { pt: 'à direita', en: 'right' },
  'tooltip.side.bottom': { pt: 'embaixo', en: 'bottom' },
  'tooltip.side.left': { pt: 'à esquerda', en: 'left' },

  // ajuda
  'tooltip.demo.help.title': { pt: 'Ajuda ao lado de um texto (a dica é a descrição)', en: 'Help next to a text (the hint is the description)' },
  'tooltip.demo.help.term': { pt: 'Prazo de entrega: 5 dias úteis', en: 'Delivery time: 5 business days' },
  'tooltip.demo.help.button': { pt: 'Sobre o prazo', en: 'About the delivery time' },
  'tooltip.demo.help.text': {
    pt: 'Contados a partir da confirmação do pagamento. Feriados locais podem somar 1 dia.',
    en: 'Counted from payment confirmation. Local holidays may add 1 day.'
  },

  // indisponível
  'tooltip.demo.unavailable.title': { pt: 'Explicando uma ação indisponível', en: 'Explaining an unavailable action' },
  'tooltip.demo.unavailable.hint': {
    pt: 'Um botão disabled não recebe foco nem mouse, então a dica nunca apareceria. Use aria-disabled="true": continua focável e o clique é ignorado.',
    en: 'A disabled button gets neither focus nor pointer events, so the hint would never show. Use aria-disabled="true": it stays focusable and the click is ignored.'
  },
  'tooltip.demo.unavailable.button': { pt: 'Excluir conta', en: 'Delete account' },
  'tooltip.demo.unavailable.text': { pt: 'Só administradores podem excluir a conta.', en: 'Only admins can delete the account.' },
};
