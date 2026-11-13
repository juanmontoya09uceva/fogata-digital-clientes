import { Injectable, signal, computed } from '@angular/core';
import { of } from 'rxjs';
import { Cliente } from '../model/cliente';
import { Region } from '../model/region';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private regionesMock: Region[] = [
    { id: 1, nombre: 'Norteamérica' },
    { id: 2, nombre: 'Sudamérica' },
    { id: 3, nombre: 'Europa' }
  ];

  private _clientes = signal<Cliente[]>([
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@ejemplo.com',
      createAt: new Date(),
      region: { id: 2, nombre: 'Sudamérica' }
    }
  ]);

  readonly clientes = this._clientes.asReadonly();
  readonly totalClientes = computed(() => this._clientes().length);

  cargarClientes(): void {}

  getCliente(id: number) {
    const encontrado = this._clientes().find(c => c.id === id) || new Cliente();
    return of(encontrado);
  }

  createCliente(cliente: Cliente) {
    cliente.id = this._clientes().length + 1;
    cliente.createAt = new Date();
    this._clientes.update(lista => [...lista, cliente]);
    return of(cliente);
  }

  updateCliente(cliente: Cliente) {
    this._clientes.update(lista =>
      lista.map(c => (c.id === cliente.id ? { ...cliente } : c))
    );
    return of(cliente);
  }

  deleteCliente(id: number) {
    this._clientes.update(lista => lista.filter(c => c.id !== id));
    return of(undefined);
  }

  getRegiones() {
    return of(this.regionesMock);
  }
}
