import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  public year = new Date().getFullYear();
}
