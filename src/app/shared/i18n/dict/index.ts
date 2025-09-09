import { TABLE } from './table';
import { TOAST } from './toast';
import { COMMON } from './common';
import { DIALOG } from './dialog';
import { SELECT } from './select';
import { STEPPER } from './stepper';
import { SECTIONS } from './sections';
import { ACTIONBAR } from './action-bar';
import { PAGINATION } from './pagination';

import { Dict } from '../../model/type/dict.type';

export const DICT: Dict = {
  ...COMMON,
  ...SECTIONS,
  ...STEPPER,
  ...TABLE,
  ...PAGINATION,
  ...TOAST,
  ...SELECT,
  ...ACTIONBAR,
  ...DIALOG,
};
