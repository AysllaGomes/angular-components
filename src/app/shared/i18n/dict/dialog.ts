import { Dict } from '../../model/type/dict.type';

export const DIALOG: Dict = {
  'dialog.open.default':     { pt: 'Abrir (padrão)',                 en: 'Open (default)' },
  'dialog.open.custom':      { pt: 'Abrir (ações customizadas)',     en: 'Open (custom actions)' },

  'dialog.title.confirm':    { pt: 'Confirmar exclusão',             en: 'Confirm delete' },
  'dialog.body.confirm':     { pt: 'Tem certeza? Esta ação não pode ser desfeita.', en: 'Are you sure? This action cannot be undone.' },
  'dialog.primary.confirm':  { pt: 'Confirmar',                      en: 'Confirm' },
  'dialog.secondary.cancel': { pt: 'Cancelar',                       en: 'Cancel' },

  'dialog.title.custom':     { pt: 'Configurar limite',              en: 'Configure limit' },
  'dialog.body.custom':      { pt: 'Você pode ajustar os campos e salvar as alterações.', en: 'You can adjust the fields and save your changes.' },
  'dialog.primary.save':     { pt: 'Salvar',                         en: 'Save' },
  'dialog.secondary.back':   { pt: 'Voltar',                         en: 'Back' },
};
