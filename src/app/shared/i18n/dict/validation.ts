import { Dict } from '../../model/type/dict.type';

export const VALIDATION: Dict = {
  'nav.validation': { pt: 'Validação', en: 'Validation' },

  'section.validation.title': { pt: 'Validação de formulário', en: 'Form validation' },
  'section.validation.lead': {
    pt: 'Mensagens centralizadas (pipe fieldError), máscaras de digitação (appMask) e envio que leva o foco ao primeiro erro (appFormValidation).',
    en: 'Centralized messages (fieldError pipe), input masks (appMask) and a submit that focuses the first error (appFormValidation).'
  },
  'validation.demo.title': { pt: 'Cadastro', en: 'Sign-up' },
  'validation.name': { pt: 'Nome completo', en: 'Full name' },
  'validation.name.hint': { pt: 'Como está no documento.', en: 'As shown on the document.' },
  'validation.doc': { pt: 'CPF ou CNPJ', en: 'CPF or CNPJ' },
  'validation.doc.hint': { pt: 'Aceita CNPJ alfanumérico (ex.: 12.ABC.345/01DE-35).', en: 'Accepts the alphanumeric CNPJ (e.g. 12.ABC.345/01DE-35).' },
  'validation.phone': { pt: 'Telefone', en: 'Phone' },
  'validation.cep': { pt: 'CEP', en: 'ZIP code (CEP)' },
  'validation.state': { pt: 'Estado', en: 'State' },
  'validation.state.placeholder': { pt: 'Selecione o estado', en: 'Choose a state' },
  'validation.plan': { pt: 'Plano', en: 'Plan' },
  'validation.terms': { pt: 'Li e aceito os termos de uso', en: 'I have read and accept the terms of use' },
  'validation.submit': { pt: 'Enviar', en: 'Submit' },
  'validation.reset': { pt: 'Limpar', en: 'Reset' },
  'validation.sent': { pt: 'Cadastro enviado (simulação do back-end).', en: 'Sign-up sent (back-end simulation).' },
  'validation.payload': { pt: 'Enviado ao back-end:', en: 'Sent to the back-end:' },
};
