import { RenderMode, ServerRoute } from '@angular/ssr';

import { SITE_COMPONENTS } from './site/site-components';

export const serverRoutes: ServerRoute[] = [
  // uma página pré-renderizada por componente (/componentes/table, /componentes/select...)
  {
    path: 'componentes/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SITE_COMPONENTS.map(c => ({ id: c.id }))
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
