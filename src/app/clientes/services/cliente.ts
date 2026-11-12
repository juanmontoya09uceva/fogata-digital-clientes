import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../model/cliente';
import { Region } from '../model/region';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/cliente-service/clientes';

  // Estado privado y modificable: solo el servicio puede escribirlo.
  private _clientes = signal<Cliente[]>([]);

  // Vista pública de solo lectura. Los componentes leen clientes()
  // pero no pueden llamar .set() sobre ella.
  readonly clientes = this._clientes.asReadonly();

  // Valor derivado: se recalcula solo cuando cambia la lista.
  readonly totalClientes = computed(() => this._clientes().length);

  // ── Pedir todos los clientes y guardarlos en la señal ────────────────────
  cargarClientes(): void {
    this.http.get<Cliente[]>(this.apiUrl)
      .subscribe(clientes => this._clientes.set(clientes));
  }

  // ── Pedir un cliente por su identificador ────────────────────────────────
  getCliente(id: number) {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // ── Crear ────────────────────────────────────────────────────────────────
  createCliente(cliente: Cliente) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Cliente>(this.apiUrl, cliente, { headers });
  }

  // ── Actualizar ───────────────────────────────────────────────────────────
  updateCliente(cliente: Cliente) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente, { headers });
  }

  // ── Eliminar ─────────────────────────────────────────────────────────────
  deleteCliente(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ── Las regiones, para el formulario de creación ─────────────────────────
  getRegiones() {
    return this.http.get<Region[]>(`${this.apiUrl}/regiones`);
  }
}
