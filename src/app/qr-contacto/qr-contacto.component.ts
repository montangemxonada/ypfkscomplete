import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';
import { CommonModule } from '@angular/common';
import jsQR from 'jsqr';
@Component({
  selector: 'app-qr-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-contacto.component.html',
  styleUrl: './qr-contacto.component.scss'
})
export class QrContactoComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  phoneNumber: string = ""
  qr: string = ""
  name: string = ""
  app: string = "Yape"
  loading: boolean = false;
  success: boolean = false;
  message: string = '';

  constructor(private router: Router, private apiService: ApisService){
  }
  onChangeNombre(event: Event): void {
    this.name = (event.target as HTMLInputElement).value;
  }
  onChangeDestino(event: Event): void {
    this.app = (event.target as HTMLSelectElement).value;
  }
  onChangeNumero(event: Event): void {
    this.phoneNumber = (event.target as HTMLInputElement).value;
  }
  registrar() {
    if (this.name && this.qr && this.app) {  
      this.loading = true;
      this.success = false;
      this.message = 'Guardando datos...';
      // console.log('Attempting to save phone number:', this.qr, this.name, this.app); // Log input values
      if(this.phoneNumber){
        console.log('phoneNumber true: ' + this.phoneNumber)
      } else{
        this.phoneNumber = 'NA'
      }
      this.apiService.guardarQRYape(this.qr, this.phoneNumber, this.name, this.app).subscribe(
        (response: any) => {
          console.log('qr true: ' + this.qr)
          console.log('name true: ' + this.name)
          console.log('Respuesta de la API:', response);
          this.success = true;
          this.message = 'Datos guardados correctamente.';
        },
        (error: any) => {
          this.loading = false;
          this.success = false;
          this.message = 'Error al guardar los datos. Por favor, intenta nuevamente.';
          console.error('Error al guardar los datos:', error);
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
  onFileSelected(event: any): void {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              this.qr = code.data;
            } else {
              console.error('No QR code found in the image.');
            }
          } else {
            console.error('Could not get 2D context from canvas.');
          }
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
  openFileInput(): void {
    // Simula el clic en el elemento de entrada de tipo archivo
    this.fileInput.nativeElement.click();
  }
}
