import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  theme = inject(ThemeService);
  toggleTheme() { this.theme.toggle(); }
}
