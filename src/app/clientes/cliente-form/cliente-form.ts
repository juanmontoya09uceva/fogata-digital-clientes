import { Component, inject, input, output, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../model/cliente';

@Component({
  selector: 'app-cliente-form',
  imports: [FormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteFormComponent {

  cliente = input.required<Cliente>();
  onSave = output<Cliente>();

  activeModal = inject(NgbActiveModal);

  // Copia editable, resincronizada cuando cliente() cambia.
  form = linkedSignal(() => ({ ...this.cliente() }));

  cancel(): void {
    this.activeModal.dismiss();
  }

  saveCliente(): void {
    this.onSave.emit(this.form());
    this.activeModal.close(this.form());
  }
}
