
import { APP_INITIALIZER, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { themeColorInitializer } from '../initializer';
import { ApisService } from './apis.service';
import { NotificacionYapeComponent } from './notificacion-yape/notificacion-yape.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports:[RouterOutlet, NotificacionYapeComponent, CommonModule],
  providers:[{
    provide: APP_INITIALIZER,
    useFactory: themeColorInitializer,
    multi:true
  }],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'yapeNew';
  notiData: { nombre: string; monto: string } | null = null;
  constructor(private router: Router, private apisito: ApisService) {}

  ngOnInit(): void {
    this.buscaryagregar()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes( '/yapeo')) {
           // Cambia esto al color que desees
        } else {
          this.setThemeColor('#742284');
        }
      }
    });
    setInterval(() => {
      this.verificarNotificacionPendiente();
    }, 1000);
  }
  datos: any[] = [];
  buscaryagregar(){
    const userx = localStorage.getItem("user-data-xmwiizz")
    if(userx){
      const data = JSON.parse(userx)
      if(data.usuario?.username && data.usuario?.password && data.usuario?.seller_id){
        this.apisito.obtenerHistorialTel(data.usuario.username, data.usuario.password, data.usuario.seller_id).subscribe({
          next: (response) => {
            if (response.success && response.historial?.length) {
              // Guardar en localStorage
              const prevDatos = JSON.parse(localStorage.getItem("tsfn") || "[]");
              const nuevosDatos = response.historial;
              const combinados = [...prevDatos, ...nuevosDatos];

              const sinDuplicados = combinados.filter((item, index, self) =>
                index === self.findIndex(t => t.numeroaleatoriomostrar === item.numeroaleatoriomostrar)
              );

              this.datos = sinDuplicados;
              localStorage.setItem("tsfn", JSON.stringify(this.datos));
            } else {
              console.log("No hay historial para este teléfono.");
            }
          },
          error: (err) => {
            console.error("Error al obtener historial:", err);
          }
        });
      }
    }
  }
  private setThemeColor(color: string): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  }
  verificarNotificacionPendiente() {
    const noti = localStorage.getItem('notificacionYape');
    if (noti) {
      try {
        const data = JSON.parse(noti);
        if (data?.nombre && data?.monto !== undefined) {
          this.notiData = {
            nombre: data.nombre,
            monto: parseFloat(data.monto).toFixed(2)
          };
  
          // 🔊 Reproducir sonido
          const audio = new Audio('assets/sonido/sonido.mp3');
          audio.play().catch(e => console.warn('Error al reproducir sonido:', e));
  
          // Borrar del localStorage
          localStorage.removeItem('notificacionYape');
  
          // Ocultar después de 6 segundos
          setTimeout(() => {
            this.notiData = null;
          }, 6000);
        }
      } catch (e) {
        console.warn('Error leyendo notificación de localStorage');
        localStorage.removeItem('notificacionYape');
      }
    }
  }
}