import { TABLE } from './table';
import { TOAST } from './toast';
import { COMMON } from './common';
import { SELECT } from './select';
import { STEPPER } from './stepper';
import { SECTIONS } from './sections';
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
};
