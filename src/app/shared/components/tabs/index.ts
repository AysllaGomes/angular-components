import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { TabContentDirective, TabLabelDirective } from './tab-templates.directive';

export { TabComponent, TabsComponent, TabContentDirective, TabLabelDirective };
export type { TabsActivation } from './tabs.component';

/** tudo que um template com abas usa: `imports: [...TABS_IMPORTS]` */
export const TABS_IMPORTS = [TabsComponent, TabComponent, TabLabelDirective, TabContentDirective] as const;
