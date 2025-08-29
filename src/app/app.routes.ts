import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'demo', pathMatch: 'full' },
  {
    path: 'demo',
    loadComponent: () =>
      import('./pages/order-flow/order-flow.component').then(m => m.OrderFlowComponent)
  }
];
