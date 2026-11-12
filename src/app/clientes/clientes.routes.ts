import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle';

export const CLIENTES_ROUTES: Routes = [
  { path: '', component: ClientesComponent },
  { path: 'detalle/:id', component: ClienteDetalleComponent }
];
