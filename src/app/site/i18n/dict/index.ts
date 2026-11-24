import { TABS } from './tabs';
import { HOME } from './home';
import { NOT_FOUND } from './not-found';
import { COMPONENT_PAGE } from './component-page';
import { TABLE } from './table';
import { TOAST } from './toast';
import { BUTTON } from './button';
import { COMMON } from './common';
import { DIALOG } from './dialog';
import { SELECT } from './select';
import { TOOLTIP } from './tooltip';
import { STEPPER } from './stepper';
import { CHECKBOX } from './checkbox';
import { SECTIONS } from './sections';
import { ACTIONBAR } from './action-bar';
import { VALIDATION } from './validation';
import { PAGINATION } from './pagination';
import { TREE_SELECT } from './tree-select';
import { RADIO_SWITCH } from './radio-switch';
import { TEXT_FIELD } from './text-field';

import { Dict } from '../i18n.types';

export const DICT: Dict = {
  ...COMMON,
  ...HOME,
  ...NOT_FOUND,
  ...COMPONENT_PAGE,
  ...SECTIONS,
  ...STEPPER,
  ...TABLE,
  ...PAGINATION,
  ...TOAST,
  ...SELECT,
  ...ACTIONBAR,
  ...DIALOG,
  ...BUTTON,
  ...CHECKBOX,
  ...TREE_SELECT,
  ...RADIO_SWITCH,
  ...VALIDATION,
  ...TEXT_FIELD,
  ...TABS,
  ...TOOLTIP,
};
