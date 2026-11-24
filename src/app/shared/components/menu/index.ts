import { MenuComponent } from './menu.component';
import { MenuTriggerDirective } from './menu-trigger.directive';
import { MenuItemDirective, MenuSeparatorDirective } from './menu.directives';

export { MenuComponent, MenuTriggerDirective, MenuItemDirective, MenuSeparatorDirective };
export type { MenuFocus, MenuTriggerRef } from './menu.component';
export type { MenuItemTone } from './menu.directives';
export type { MenuPlacement } from './menu-position';

/** tudo que um template com menu usa: `imports: [...MENU_IMPORTS]` */
export const MENU_IMPORTS = [MenuComponent, MenuTriggerDirective, MenuItemDirective, MenuSeparatorDirective] as const;
