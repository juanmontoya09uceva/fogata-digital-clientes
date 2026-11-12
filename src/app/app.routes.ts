import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.routes').then(m => m.CLIENTES_ROUTES)
  }
];
