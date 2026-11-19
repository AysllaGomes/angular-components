import { Dict } from '../../model/type/dict.type';

export const COMMON: Dict = {
  // header / nav
  'brand': {
    pt: 'Angular Components',
    en: 'Angular Components'
  },
  'nav.select': {
    pt: 'Select',
    en: 'Select'
  },
  'nav.stepper': {
    pt: 'Stepper',
    en: 'Stepper'
  },
  'nav.table': {
    pt: 'Tabela',
    en: 'Table'
  },
  'nav.pagination': {
    pt: 'Paginação',
    en: 'Pagination'
  },
  'nav.toast': {
    pt: 'Toast',
    en: 'Toast'
  },
  'nav.actionbar': { pt: 'ActionBar', en: 'Action bar' },
  'nav.dialog': { pt: 'Dialog', en: 'Dialog' },
  'nav.button': { pt: 'Button', en: 'Button' },
  'nav.checkbox': { pt: 'Checkbox', en: 'Checkbox' },

  // grupos do menu
  'nav.group.forms':      { pt: 'Formulário',        en: 'Forms' },
  'nav.group.data':       { pt: 'Dados',             en: 'Data' },
  'nav.group.overlays':   { pt: 'Sobreposições',     en: 'Overlays' },
  'nav.group.navigation': { pt: 'Navegação e ações', en: 'Navigation & actions' },

  'header.menu': {
    pt: 'Menu',
    en: 'Menu'
  },
  'header.lang.tooltip': {
    pt: 'Português (Brasil)',
    en: 'English'
  },
  'header.accent': {
    pt: 'Cor de destaque',
    en: 'Accent color'
  },
  'header.lang': {
    pt: 'Idioma',
    en: 'Language'
  },

  'accent.teal':   { pt: 'Verde (teal)', en: 'Teal' },
  'accent.orange': { pt: 'Laranja',      en: 'Orange' },
  'accent.violet': { pt: 'Violeta',      en: 'Violet' },
  'accent.blue':   { pt: 'Azul',         en: 'Blue' },
  'accent.rose':   { pt: 'Rosa',         en: 'Rose' },

  // buttons
  'button.theme.light': {
    pt: 'Claro',
    en: 'Light'
  },
  'button.theme.dark': {
    pt: 'Escuro',
    en: 'Dark'
  },
  'button.loading.sim': {
    pt: 'Simular loading (1.5s)',
    en: 'Simulate loading (1.5s)'
  },
  'button.empty.toggle': {
    pt: 'Alternar vazio',
    en: 'Toggle empty'
  },

  'table.total': {
    pt: 'Total de {{n}} registro(s)',
    en: 'Total of {{n}} record(s)'
  },

  // Form helpers
  'form.required.label': {
    pt: 'requerido',
    en: 'required'
  },
  'form.required.error': {
    pt: 'Campo obrigatório',
    en: 'This field is required'
  },
  // mensagens de erro padrão (FormErrorsService / pipe fieldError); {{x}} = dados do erro
  'form.error.required':     { pt: 'Campo obrigatório', en: 'This field is required' },
  'form.error.email':        { pt: 'E-mail inválido', en: 'Invalid email' },
  'form.error.minlength':    { pt: 'Mínimo de {{requiredLength}} caracteres', en: 'At least {{requiredLength}} characters' },
  'form.error.maxlength':    { pt: 'Máximo de {{requiredLength}} caracteres', en: 'At most {{requiredLength}} characters' },
  'form.error.min':          { pt: 'O mínimo é {{min}}', en: 'The minimum is {{min}}' },
  'form.error.max':          { pt: 'O máximo é {{max}}', en: 'The maximum is {{max}}' },
  'form.error.pattern':      { pt: 'Formato inválido', en: 'Invalid format' },
  'form.error.cpf':          { pt: 'CPF inválido', en: 'Invalid CPF' },
  'form.error.cnpj':         { pt: 'CNPJ inválido', en: 'Invalid CNPJ' },
  'form.error.cpfCnpj':      { pt: 'CPF ou CNPJ inválido', en: 'Invalid CPF or CNPJ' },
  'form.error.invalid':      { pt: 'Valor inválido', en: 'Invalid value' },

  'form.hint': {
    pt: 'Texto de apoio exibido abaixo do campo.',
    en: 'Helper text shown below the field.'
  }
};
