import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TPipe } from '../shared/i18n/t.pipe';
import { HeaderComponent } from '../demo/layout/header/header.component';
import { FooterComponent } from '../demo/layout/footer/footer.component';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';
import { HomeShowcaseComponent } from './showcase/home-showcase.component';
import { HomeViewsComponent } from './views/home-views.component';
import { HomeCatalogComponent } from './catalog/home-catalog.component';

/**
 * Apresentação (rota "/"): o que é, por que usar e como começar.
 * A demo completa continua em /demo, com os mesmos cabeçalho e rodapé.
 */
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink, TPipe,
    HeaderComponent, FooterComponent, ToastContainerComponent,
    HomeShowcaseComponent, HomeViewsComponent, HomeCatalogComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  /** só números que dá para conferir no repositório */
  readonly proofs = [
    { value: '0', key: 'home.proof.deps' },
    { value: 'axe', key: 'home.proof.tests' },
    { value: 'PT · EN', key: 'home.proof.langs' },
    { value: '2 × 5', key: 'home.proof.themes' },
  ];
}
