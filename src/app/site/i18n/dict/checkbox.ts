import { Dict } from '../i18n.types';

export const CHECKBOX: Dict = {
  // seção
  'section.checkbox.title': { pt: 'Checkbox', en: 'Checkbox' },
  'section.checkbox.lead': {
    pt: 'Checkbox acessível com estado parcial, integrado a formulários. A caixa visual (app-checkbox-mark) também pode ser usada sozinha dentro de outros componentes.',
    en: 'Accessible checkbox with a partial state, integrated with forms. The visual box (app-checkbox-mark) can also be used on its own inside other components.'
  },

  // básico
  'checkbox.demo.basic.title': { pt: 'Básico', en: 'Basic' },
  'checkbox.demo.basic.label': { pt: 'Quero receber novidades', en: 'I want to receive news' },
  'checkbox.demo.basic.value': { pt: 'Valor: {{v}}', en: 'Value: {{v}}' },

  // selecionar todos
  'checkbox.demo.all.title': { pt: 'Selecionar todos (estado parcial)', en: 'Select all (partial state)' },
  'checkbox.demo.all.parent': { pt: 'Todas as notificações', en: 'All notifications' },
  'checkbox.demo.all.email':  { pt: 'E-mail', en: 'Email' },
  'checkbox.demo.all.sms':    { pt: 'SMS', en: 'SMS' },
  'checkbox.demo.all.push':   { pt: 'Push no celular', en: 'Mobile push' },
  'checkbox.demo.all.hint': {
    pt: 'Com só alguns marcados, o principal fica parcial; clicar nele marca todos.',
    en: 'With only some checked, the main one is partial; clicking it checks all.'
  },

  // estados
  'checkbox.demo.states.title':     { pt: 'Estados', en: 'States' },
  'checkbox.demo.states.unchecked': { pt: 'Desmarcado', en: 'Unchecked' },
  'checkbox.demo.states.checked':   { pt: 'Marcado', en: 'Checked' },
  'checkbox.demo.states.mixed':     { pt: 'Parcial', en: 'Partial' },
  'checkbox.demo.states.disabled':  { pt: 'desabilitado', en: 'disabled' },

  // formulário
  'checkbox.demo.forms.title': { pt: 'Com Reactive Forms (aceite obrigatório)', en: 'With Reactive Forms (required consent)' },
  'checkbox.demo.forms.label': { pt: 'Li e aceito os termos de uso', en: 'I have read and accept the terms of use' },
  'checkbox.demo.forms.hint':  { pt: 'Obrigatório para continuar.', en: 'Required to continue.' },
  'checkbox.demo.forms.error': { pt: 'Você precisa aceitar os termos.', en: 'You need to accept the terms.' },
  'checkbox.demo.forms.submit': { pt: 'Continuar', en: 'Continue' },
};
