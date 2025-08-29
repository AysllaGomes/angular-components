import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  private theme = inject(ThemeService);
  current = this.theme.theme;
  toggle = () => this.theme.toggle();
}
