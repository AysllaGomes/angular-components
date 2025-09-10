import { Dict } from '../../model/type/dict.type';

export const BUTTON: Dict = {
  // Section
  'section.button.title': { pt: 'Button', en: 'Button' },
  'section.button.lead':  { pt: 'Exemplos de uso do componente/diretiva appButton.', en: 'Examples of using the appButton directive/component.' },

  // Groups
  'button.demo.variants.title': { pt: 'Variações (tone="accent")', en: 'Variants (tone="accent")' },
  'button.demo.tones.title':    { pt: 'Tons',                     en: 'Tones' },
  'button.demo.sizes.title':    { pt: 'Tamanhos',                 en: 'Sizes' },
  'button.demo.disabled.title': { pt: 'Desabilitado',             en: 'Disabled' },
  'button.demo.icons.title':    { pt: 'Com ícone',                 en: 'With icon' },
  'button.demo.links.title':    { pt: 'Links e routerLink',       en: '<a> and routerLink' },
  'button.demo.block.title':    { pt: 'Largura total (layout)',   en: 'Full width (layout)' },

  // Labels (variants)
  'button.label.solidDefault': { pt: 'Sólido (padrão)', en: 'Solid (default)' },
  'button.label.outline':      { pt: 'Contornado',      en: 'Outline' },
  'button.label.ghost':        { pt: 'Fantasma',        en: 'Ghost' },
  'button.label.link':         { pt: 'Link',            en: 'Link' },

  // Tones
  'button.tone.accent':  { pt: 'Acento',  en: 'Accent' },
  'button.tone.neutral': { pt: 'Neutro',  en: 'Neutral' },
  'button.tone.danger':  { pt: 'Perigo',  en: 'Danger' },

  // Tone combos
  'button.combo.outlineNeutral': { pt: 'Contornado/Neutro', en: 'Outline/Neutral' },
  'button.combo.ghostDanger':    { pt: 'Fantasma/Perigo',   en: 'Ghost/Danger' },

  // Sizes
  'button.size.xs': { pt: 'XS', en: 'XS' },
  'button.size.sm': { pt: 'SM', en: 'SM' },
  'button.size.md': { pt: 'MD', en: 'MD' },
  'button.size.lg': { pt: 'LG', en: 'LG' },

  // Disabled
  'button.disabled.solid':   { pt: 'Sólido desabilitado',   en: 'Solid disabled' },
  'button.disabled.outline': { pt: 'Contornado desabilitado', en: 'Outline disabled' },
  'button.disabled.ghost':   { pt: 'Fantasma desabilitado', en: 'Ghost disabled' },
  'button.disabled.link':    { pt: 'Link desabilitado',     en: 'Link disabled' },

  // With icon
  'button.icon.primary': { pt: 'Primário', en: 'Primary' },
  'button.icon.back':    { pt: 'Voltar',   en: 'Back' },
  'button.icon.delete':  { pt: 'Excluir',  en: 'Delete' },

  // Links
  'button.link.open': { pt: 'Abrir link',          en: 'Open link' },
  'button.link.home': { pt: 'Home (routerLink)',   en: 'Home (routerLink)' },
  'button.link.docs': { pt: 'Docs (link)',         en: 'Docs (link)' },

  // Block
  'button.block.continue': { pt: 'Continuar', en: 'Continue' },
  'button.block.back':     { pt: 'Voltar',    en: 'Back' },
  'button.demo.block.tip': {
    pt: 'Dica: use style="width:100%" ou uma utility CSS. (Se quisermos, dá pra adicionar um input [block] no futuro.)',
    en: 'Tip: use style="width:100%" or a CSS utility. (We can add a [block] input later if needed.)'
  },
};
