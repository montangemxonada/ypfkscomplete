import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';
import { ApiLogService } from '../api-log.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.scss'
})
export class ContactosComponent {
  phoneNumber: string = "" 
  name: string = ""
  app: string = "Yape"
  loading: boolean = false;
  success: boolean = false;
  message: string = '';

  constructor(private router: Router,private api: ApiLogService , private apiService: ApisService){
  }
  onChangeNombre(event: Event): void {
    this.name = (event.target as HTMLInputElement).value;
  }
  onChangeNumero(event: Event): void {
    this.phoneNumber = (event.target as HTMLInputElement).value;
  }
  onChangeDestino(event: Event): void {
    this.app = (event.target as HTMLSelectElement).value;
  }
  registrar() {
    if (this.name && this.phoneNumber && this.app) {  
      this.loading = true;
      this.success = false;
      this.message = 'Guardando datos...';
      // console.log('Datos:', this.phoneNumber, this.name, this.app); // Log input values
      
      this.apiService.guardarTelefonoYape(this.phoneNumber, this.name, this.app).subscribe((response) => {
          // console.log('Respuesta de la API:', response);
          this.success = true;
          this.message = 'Datos guardados correctamente.';
        },
        (error: any) => {
          this.success = true;
          this.message = 'Error al guardar el teléfono.';
          console.error('Error al guardar el teléfono:', error.message || error);
          if (error.error) {
            console.error('Detalles del error:', error.error);
          }
        }
      );
    } else {
      this.loading = true;
      this.success = true;
      this.message = 'Todos los campos son obligatorios.';
      console.error('Todos los campos son obligatorios');
    }
  }
  cerrar(){
    this.loading = false;
  }
}
