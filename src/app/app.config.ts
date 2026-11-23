import { ApplicationConfig, computed, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';

import { I18nService } from './site/services/i18n.service';
import { UI_LABELS_EN, UI_LABELS_PT, provideUiLabels } from './shared/labels';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // anchorScrolling: links com fragmento (/demo#table, /#componentes) rolam até a seção
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    // textos dos componentes acompanham o idioma da demo (os componentes não conhecem o i18n dela)
    provideUiLabels(() => {
      const i18n = inject(I18nService);
      return computed(() => (i18n.lang() === 'en' ? UI_LABELS_EN : UI_LABELS_PT));
    })
  ]
};
