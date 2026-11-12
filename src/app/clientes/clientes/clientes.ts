import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ClienteService } from '../services/cliente';
import { Cliente } from '../model/cliente';
import { Region } from '../model/region';

@Component({
  selector: 'app-clientes',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {

  // El servicio se declara protegido porque la plantilla lo usa directamente
  protected clienteService = inject(ClienteService);

  faEdit = faEdit;
  faTrash = faTrash;
  faUserPlus = faUserPlus;

  ngOnInit(): void {
    this.clienteService.cargarClientes();
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: '¿Eliminar este cliente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe(() => {
          this.clienteService.cargarClientes();
          Swal.fire('Eliminado', 'El cliente fue eliminado.', 'success');
        });
      }
    });
  }

  editCliente(cliente: Cliente): void {
    Swal.fire({
      title: 'Editar cliente',
      html: `
        <input id="nombre"   class="swal2-input" placeholder="Nombre"   value="${cliente.nombre}">
        <input id="apellido" class="swal2-input" placeholder="Apellido" value="${cliente.apellido}">
        <input id="email"    class="swal2-input" placeholder="Email"    value="${cliente.email}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        cliente.nombre   = (document.getElementById('nombre')   as HTMLInputElement).value;
        cliente.apellido = (document.getElementById('apellido') as HTMLInputElement).value;
        cliente.email    = (document.getElementById('email')    as HTMLInputElement).value;
        return cliente;
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.clienteService.updateCliente(result.value!).subscribe(() => {
          this.clienteService.cargarClientes();
          Swal.fire('Actualizado', 'El cliente fue actualizado.', 'success');
        });
      }
    });
  }

  addCliente(): void {
    this.clienteService.getRegiones().subscribe(regiones => {
      const opcionesRegion = regiones
        .map(r => `<option value="${r.id}">${r.nombre}</option>`)
        .join('');

      Swal.fire({
        title: 'Nuevo cliente',
        html: `
          <input id="nombre"   class="swal2-input" placeholder="Nombre">
          <input id="apellido" class="swal2-input" placeholder="Apellido">
          <input id="email"    class="swal2-input" placeholder="Email">
          <select id="region"  class="swal2-input">
            <option value="">-- Selecciona región --</option>
            ${opcionesRegion}
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const nombre   = (document.getElementById('nombre')   as HTMLInputElement).value;
          const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
          const email    = (document.getElementById('email')    as HTMLInputElement).value;
          const regionId = (document.getElementById('region')   as HTMLSelectElement).value;

          if (!nombre || !apellido || !email || !regionId) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return false;
          }

          const nuevoCliente = new Cliente();
          nuevoCliente.nombre   = nombre;
          nuevoCliente.apellido = apellido;
          nuevoCliente.email    = email;
          nuevoCliente.region   = regiones.find(r => r.id === +regionId) || new Region();
          return nuevoCliente;
        }
      }).then(result => {
        if (result.isConfirmed && result.value) {
          this.clienteService.createCliente(result.value).subscribe(() => {
            this.clienteService.cargarClientes();
            Swal.fire('Creado', 'El cliente fue creado.', 'success');
          });
        }
      });
    });
  }
}
