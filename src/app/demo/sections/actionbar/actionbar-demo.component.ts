import { Component, signal } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { ActionBarComponent } from '../../../shared/components/actionbar/actionbar.component';

@Component({
  selector: 'app-actionbar-demo',
  standalone: true,
  imports: [ActionBarComponent, TPipe],
  templateUrl: './actionbar-demo.component.html',
  styleUrl: './actionbar-demo.component.sass'
})
export class ActionBarDemoComponent {
  openSm   = signal(false);
  openMd   = signal(false);
  openLg   = signal(false);
  openAuto = signal(false);
}
