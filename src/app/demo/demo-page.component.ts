import { Component, ChangeDetectionStrategy } from '@angular/core';

import { HeaderComponent } from '../site/layout/header/header.component';
import { FooterComponent } from '../site/layout/footer/footer.component';
import { TableDemoComponent } from './sections/table/table-demo.component';
import { ToastDemoComponent } from './sections/toast/toast-demo.component';
import { SelectDemoComponent } from './sections/select/select-demo.component';
import { DialogDemoComponent } from './sections/dialog/dialog-demo.component';
import { StepperDemoComponent } from './sections/stepper/stepper-demo.component';
import { ActionBarDemoComponent } from './sections/actionbar/actionbar-demo.component';
import { PaginationDemoComponent } from './sections/pagination/pagination-demo.component';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';
import {ButtonDemoComponent} from './sections/button/button-demo.component';
import { CheckboxDemoComponent } from './sections/checkbox/checkbox-demo.component';
import { TreeSelectDemoComponent } from './sections/tree-select/tree-select-demo.component';
import { RadioSwitchDemoComponent } from './sections/radio-switch/radio-switch-demo.component';
import { TabsDemoComponent } from './sections/tabs/tabs-demo.component';
import { TooltipDemoComponent } from './sections/tooltip/tooltip-demo.component';
import { ValidationDemoComponent } from './sections/validation/validation-demo.component';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    TableDemoComponent,
    ToastDemoComponent,
    SelectDemoComponent,
    DialogDemoComponent,
    StepperDemoComponent,
    ActionBarDemoComponent,
    PaginationDemoComponent,
    ToastContainerComponent,
    ButtonDemoComponent,
    CheckboxDemoComponent,
    TreeSelectDemoComponent,
    RadioSwitchDemoComponent,
    ValidationDemoComponent,
    TabsDemoComponent,
    TooltipDemoComponent,
  ],
  templateUrl: './demo-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class DemoPageComponent {}
