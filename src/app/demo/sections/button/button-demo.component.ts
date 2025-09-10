import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { ButtonDirective } from '../../../shared/components/button/button.directive';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [
    TPipe,
    RouterLink,
    CommonModule,
    ButtonDirective,
  ],
  templateUrl: './button-demo.component.html',
  styleUrl: './button-demo.component.sass'
})
export class ButtonDemoComponent {}
