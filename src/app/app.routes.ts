import { Routes } from '@angular/router';

export const routes: Routes = [
  // apresentação: o que é, por que usar e como começar
  {
    path: '',
    pathMatch: 'full',
    title: 'Angular Components',
    loadComponent: () => import('./home/home-page.component').then(m => m.HomePageComponent)
  },
  // catálogo: todos os componentes ao vivo (links /demo#tabela continuam valendo)
  {
    path: 'demo',
    title: 'Demo · Angular Components',
    loadComponent: () => import('./demo/demo-page.component').then(m => m.DemoPageComponent)
  },
  // uma página por componente: por que existe, quando usar, API, acessibilidade, o que copiar
  {
    path: 'componentes/:id',
    loadComponent: () => import('./component-page/component-page.component').then(m => m.ComponentPageComponent)
  },
  { path: 'componentes', pathMatch: 'full', redirectTo: '' },
  // o relatório do axe de todos os componentes
  {
    path: 'acessibilidade',
    loadComponent: () => import('./a11y-page/a11y-page.component').then(m => m.A11yPageComponent)
  },
  // endereço desconhecido: página 404 (explica, sugere o componente e oferece busca);
  // o título vem da própria página, no idioma atual
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];
