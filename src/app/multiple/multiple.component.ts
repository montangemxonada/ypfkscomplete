import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-multiple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple.component.html',
  styleUrl: './multiple.component.css'
})
export class MultipleComponent {
  constructor(private router: Router) {}
  opciones = [
    { titulo: 'Datos de mi cuenta', ruta: '/cuenta', img: 'datos' },
    { titulo: 'Agregar contacto', ruta: '/contactos', img: 'contacto' },
    { titulo: 'Agregar QR', ruta: '/qrcontacto', img: 'qr' },
    { titulo: 'Editar voucher', ruta: '/editable', img: 'voucher' },
    { titulo: 'Programar notificación', ruta: '/notificaciones', img: 'contacto' },
  ];
  otros = [
    { titulo: 'Contactar soporte', enlace: 'https://t.me/appsfake', img: 'soporte' },
    { titulo: 'Términos y condiciones', enlace: 'https://t.me/TerminoslCondiciones', img: 'terminos' },
    { titulo: 'Videotutoriales', enlace: 'https://t.me/appsfake', img: 'terminos' },
  ]
  irOpcion(ruta: string) {
    this.router.navigate([ruta]);
  }
  irEnlace(enlace: string) {
      window.open(enlace, '_blank');
  }
  home(){
    this.router.navigate(['/home'])
  }
}
