import { Component, inject, input, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ClienteService } from '../services/cliente';
import { Cliente } from '../model/cliente';

@Component({
  selector: 'app-cliente-detalle',
  imports: [RouterLink, DatePipe],
  templateUrl: './cliente-detalle.html',
  styleUrl: './cliente-detalle.css'
})
export class ClienteDetalleComponent {

  private clienteService = inject(ClienteService);
  private router = inject(Router);

  // El nombre de esta propiedad coincide con el del parámetro de la ruta
  // (:id). Angular la llena sola gracias a withComponentInputBinding().
  id = input.required<string>();

  cliente = signal<Cliente>(new Cliente());

  constructor() {
    // Se ejecuta al crear el componente y cada vez que cambie id().
    effect(() => {
      this.clienteService.getCliente(+this.id()).subscribe(cliente => {
        this.cliente.set(cliente);
      });
    });
  }

  deleteCliente(): void {
    Swal.fire({
      title: '¿Eliminar cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(this.cliente().id!).subscribe(() => {
          this.router.navigate(['/clientes']);
          Swal.fire('Eliminado', 'El cliente fue eliminado.', 'success');
        });
      }
    });
  }
}
