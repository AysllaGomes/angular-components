import { Component, ChangeDetectionStrategy } from '@angular/core';

import { TPipe } from '../../../site/i18n/t.pipe';
import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { TooltipPosition } from '../../../shared/components/tooltip/tooltip-position';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [TPipe, ButtonDirective, TooltipDirective],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TooltipDemoComponent {
  readonly positions: TooltipPosition[] = ['top', 'right', 'bottom', 'left'];
}
