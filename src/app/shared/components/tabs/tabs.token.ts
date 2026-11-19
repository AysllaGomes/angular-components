import { InjectionToken, Signal } from '@angular/core';

import type { TabComponent } from './tab.component';

/** o que cada `app-tab` precisa saber do `app-tabs` que o contém */
export interface TabsHost {
  readonly uid: string;
  readonly tabs: Signal<readonly TabComponent[]>;
  readonly activeKey: Signal<string | null>;
  readonly keepAlive: Signal<boolean>;
}

export const TABS_HOST = new InjectionToken<TabsHost>('TABS_HOST');
