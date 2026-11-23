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
  { path: '**', redirectTo: '' }
];
