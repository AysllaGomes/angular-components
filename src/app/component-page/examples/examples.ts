import { Type } from '@angular/core';

import { CheckboxExampleComponent, CheckboxGroupExampleComponent, RadioExampleComponent, SelectExampleComponent, SwitchExampleComponent, TreeSelectExampleComponent, ValidationExampleComponent } from './forms.examples';
import { PaginationExampleComponent, TableExampleComponent } from './data.examples';
import { ActionBarExampleComponent, DialogExampleComponent, ToastExampleComponent, TooltipExampleComponent } from './overlays.examples';
import { ButtonExampleComponent, StepperExampleComponent, TabsExampleComponent } from './navigation.examples';

/*
 * Exemplos ao vivo das páginas de componente, por id de SITE_COMPONENTS. Cada um
 * reproduz o exemplo de "Uso" do .md (o que a aba "Código" mostra), no idioma da
 * página: o código e o exemplo precisam bater. Um id sem exemplo mostra só o código
 * e o link da demo.
 */
export const LIVE_EXAMPLES: Record<string, Type<unknown>> = {
  // Formulário
  select: SelectExampleComponent,
  treeselect: TreeSelectExampleComponent,
  checkbox: CheckboxExampleComponent,
  checkboxgroup: CheckboxGroupExampleComponent,
  radio: RadioExampleComponent,
  switch: SwitchExampleComponent,
  validation: ValidationExampleComponent,
  // Dados
  table: TableExampleComponent,
  pagination: PaginationExampleComponent,
  // Sobreposições
  dialog: DialogExampleComponent,
  actionbar: ActionBarExampleComponent,
  tooltip: TooltipExampleComponent,
  toast: ToastExampleComponent,
  // Navegação e ações
  tabs: TabsExampleComponent,
  stepper: StepperExampleComponent,
  button: ButtonExampleComponent,
};
