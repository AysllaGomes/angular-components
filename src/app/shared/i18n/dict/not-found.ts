import { Dict } from '../../model/type/dict.type';

/** textos da página 404 */
export const NOT_FOUND: Dict = {
  'notfound.title': { pt: 'Página não encontrada · Angular Components', en: 'Page not found · Angular Components' },
  'notfound.heading': { pt: 'Esta página não existe', en: 'This page does not exist' },
  'notfound.lead': {
    pt: 'O endereço abaixo não leva a nenhuma página deste site. O link pode estar desatualizado ou ter um erro de digitação.',
    en: 'The address below does not lead to any page on this site. The link may be outdated or have a typo.'
  },
  'notfound.address': { pt: 'Endereço:', en: 'Address:' },

  'notfound.suggestion.label': { pt: 'Sugestão', en: 'Suggestion' },
  'notfound.suggestion.text': { pt: 'Você quis dizer {{name}}? Ele está na demo.', en: 'Did you mean {{name}}? It is in the demo.' },
  'notfound.suggestion.cta': { pt: 'Ver {{name}} na demo', en: 'See {{name}} in the demo' },

  'notfound.paths': { pt: 'Caminhos', en: 'Ways out' },
  'notfound.home': { pt: 'Ir para o início', en: 'Go to the home page' },
  'notfound.demo': { pt: 'Abrir a demo', en: 'Open the demo' },

  'notfound.search.title': { pt: 'Ou procure um componente', en: 'Or look for a component' },
  'notfound.search.label': { pt: 'Nome do componente', en: 'Component name' },
  'notfound.search.placeholder': { pt: 'Ex.: tabela, select, dica', en: 'E.g. table, select, tooltip' },
  'notfound.search.all': { pt: '{{n}} componentes', en: '{{n}} components' },
  'notfound.search.one': { pt: '1 componente encontrado', en: '1 component found' },
  'notfound.search.many': { pt: '{{n}} componentes encontrados', en: '{{n}} components found' },
  'notfound.search.none': { pt: 'Nenhum componente com esse nome.', en: 'No component with that name.' },
  'notfound.search.seeAll': { pt: 'Veja todos na demo', en: 'See them all in the demo' },
};
