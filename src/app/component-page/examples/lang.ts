import { computed, inject } from '@angular/core';

import { I18nService } from '../../site/services/i18n.service';

/** `true` quando a página está em inglês (chame num inicializador de campo). */
export function injectIsEn() {
  const i18n = inject(I18nService);
  return computed(() => i18n.lang() === 'en');
}
