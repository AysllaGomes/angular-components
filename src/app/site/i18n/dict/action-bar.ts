import { Dict } from '../i18n.types';

export const ACTIONBAR: Dict = {
  // seção
  'section.actionbar.title': {
    pt: 'ActionBar',
    en: 'Action bar'
  },
  'section.actionbar.lead': {
    pt: 'Sheet lateral com título, conteúdo e ações. Suporta tamanhos sm/md/lg e modo automático que se ajusta ao conteúdo.',
    en: 'Side sheet with title, content and actions. Supports sm/md/lg sizes and an automatic mode that adapts to content.'
  },

  // demo
  'actionbar.demo.triggers': { pt: 'Abrir exemplos', en: 'Open examples' },
  'actionbar.open.sm':       { pt: 'Abrir SM',        en: 'Open SM' },
  'actionbar.open.md':       { pt: 'Abrir MD',        en: 'Open MD' },
  'actionbar.open.lg':       { pt: 'Abrir LG',        en: 'Open LG' },
  'actionbar.open.auto':     { pt: 'Abrir AUTO',      en: 'Open AUTO' },
  'actionbar.demo.tip': {
    pt: 'Dica: no modo “AUTO” o tamanho muda conforme a largura do conteúdo.',
    en: 'Tip: in “AUTO” mode the size changes according to the content width.'
  },
  'actionbar.demo.placeholder': { pt: 'Substitua', en: 'Replace' },

  // confirmação a partir do painel (um modal sobre outro)
  'actionbar.demo.confirm.title': { pt: 'Confirmar a partir do painel', en: 'Confirm from the panel' },
  'actionbar.demo.confirm.tip': {
    pt: 'Um Dialog aberto por cima da ActionBar: o primeiro Esc fecha só o Dialog e o foco volta ao "Excluir pedido"; o segundo fecha o painel.',
    en: 'A Dialog opened over the action bar: the first Esc closes only the Dialog and focus returns to "Delete order"; the second one closes the panel.'
  },
  'actionbar.demo.confirm.open':   { pt: 'Ver pedido #1042', en: 'View order #1042' },
  'actionbar.demo.order.title':    { pt: 'Pedido #1042',     en: 'Order #1042' },
  'actionbar.demo.order.body':     { pt: '3 itens · R$ 249,90 · aguardando pagamento', en: '3 items · $49.90 · awaiting payment' },
  'actionbar.demo.order.delete':   { pt: 'Excluir pedido',   en: 'Delete order' },
  'actionbar.demo.order.confirm':  { pt: 'Excluir o pedido #1042?', en: 'Delete order #1042?' },
  'actionbar.demo.order.confirmBody': { pt: 'Essa ação não pode ser desfeita.', en: 'This cannot be undone.' },
  'actionbar.demo.order.yes':      { pt: 'Excluir',          en: 'Delete' },
  'actionbar.demo.order.deleted':  { pt: 'Pedido #1042 excluído.', en: 'Order #1042 deleted.' },

  // conteúdo do componente
  'actionbar.title': { pt: 'Título do actionbar', en: 'Action bar title' },
  'actionbar.cta.primary': { pt: 'Confirmar', en: 'Confirm' },
  'actionbar.cta.secondary': { pt: 'Cancelar', en: 'Cancel' },
};
