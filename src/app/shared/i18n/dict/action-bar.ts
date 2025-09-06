import { Dict } from '../../model/type/dict.type';

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

  // conteúdo do componente
  'actionbar.title': { pt: 'Título do actionbar', en: 'Action bar title' },
  'actionbar.cta.primary': { pt: 'Confirmar', en: 'Confirm' },
  'actionbar.cta.secondary': { pt: 'Cancelar', en: 'Cancel' },
};
