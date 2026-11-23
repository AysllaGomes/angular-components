import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TPipe } from '../../../shared/i18n/t.pipe';

@Component({
  selector: 'app-demo-footer',
  standalone: true,
  imports: [RouterLink, TPipe],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  public year = new Date().getFullYear();
}
