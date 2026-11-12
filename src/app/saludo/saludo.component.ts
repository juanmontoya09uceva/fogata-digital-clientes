import { Component } from '@angular/core';

@Component({
  selector: 'app-saludo',
  imports: [],
  templateUrl: './saludo.component.html',
  styleUrl: './saludo.component.css'
})
export class SaludoComponent {
  nombre = 'mundo';
  veces = 0;

  contar(): void {
    this.veces = this.veces + 1;
  }
}
