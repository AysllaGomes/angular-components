import { Component } from '@angular/core';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TableDemoComponent } from './sections/table/table-demo.component';
import { StepperDemoComponent } from './sections/stepper/stepper-demo.component';
import { PaginationDemoComponent } from './sections/pagination/pagination-demo.component';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, StepperDemoComponent, TableDemoComponent, PaginationDemoComponent],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.sass'
})
export class DemoPageComponent {}
