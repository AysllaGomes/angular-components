import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

import { TPipe } from '../../../site/i18n/t.pipe';

import { ActionBarComponent } from '../../../shared/components/actionbar/actionbar.component';
import {ButtonDirective} from '../../../shared/components/button/button.directive';

@Component({
  selector: 'app-actionbar-demo',
  standalone: true,
  imports: [ActionBarComponent, TPipe, ButtonDirective],
  templateUrl: './actionbar-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './actionbar-demo.component.sass'
})
export class ActionBarDemoComponent {
  openSm   = signal(false);
  openMd   = signal(false);
  openLg   = signal(false);
  openAuto = signal(false);
}
