import { Component } from '@angular/core';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { StepperDemoComponent } from './sections/stepper/stepper-demo.component';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, StepperDemoComponent],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.sass'
})
export class DemoPageComponent {}
