  import { CommonModule } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-notificaciones',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './notificaciones.component.html',
    styleUrl: './notificaciones.component.scss'
  })
  export class NotificacionesComponent implements OnInit {
    constructor(private router: Router){}
    minutos: number = 1;
    nombre: string = '';
    monto: number = 0;
    loading: boolean = false
    message: string = ''
    ngOnInit(): void {
      this.solicitarPermisoNotificaciones();
    }

    solicitarPermisoNotificaciones() {
      if ('Notification' in window) {
        Notification.requestPermission().then((permiso) => {
          console.log('Permiso para notificaciones:', permiso);
        });
      }
    }

    // programarNotificacion(minutos: number, nombre: string, monto: number) {
    //   this.loading = true
    //   if ('Notification' in window && Notification.permission === 'granted') {
    //     const tiempoEnMs = minutos * 60 * 1000;
    //     const montof = monto.toFixed(2)
    //     setTimeout(() => {
    //       const audio = new Audio('assets/sonido/sonido.mp3');
    //       audio.play().catch(e => console.warn('Error al reproducir sonido:', e));

    //       new Notification('Yape', {
    //         body: 'Yape! ' + nombre + ' te envio un pago por S/ ' +montof,
    //         icon: 'assets/icons/Icon.png',
            
            
    //       });
    //     }, tiempoEnMs);

    //     this.message = 'Notificación programada en ' + minutos + ' minuto(s).'
    //   } else {
    //     this.message = 'Debes permitir las notificaciones para recibir alertas.'
    //   }
    // }

    programarNotificacion(minutos: number, nombre: string, monto: number) {
      this.loading = true;
    
      const tiempoEnMs = minutos * 60 * 1000;
    
      setTimeout(() => {
        // Guardar en localStorage (será leído por AppComponent)
        const data = {
          nombre,
          monto: monto.toFixed(2)
        };
        localStorage.setItem('notificacionYape', JSON.stringify(data));
    
        this.message = `Notificación mostrada para ${nombre} por S/ ${data.monto}`;
        this.loading = true;
      }, tiempoEnMs);
    
      this.message = 'Notificación programada en ' + minutos + ' minuto(s).';
    }
    
    cerrar(){
      this.loading = false
    }
    volver(){
      this.router.navigate(["/home"])
    }
  }
