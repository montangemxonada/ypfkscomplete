import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificacion-yape',
  standalone: true,
  imports: [],
  templateUrl: './notificacion-yape.component.html',
  styleUrl: './notificacion-yape.component.scss'
})
export class NotificacionYapeComponent implements OnInit {
  @Input() nombre: string = 'Nombre Apellido';
  @Input() monto: string = '0.00';

  expandido = false;
  visible = false;
  expandir() {
    this.expandido = !this.expandido;
  }
  private touchStartY = 0;
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndY = event.changedTouches[0].clientY;
    if (this.touchStartY - touchEndY > 50) {
      this.visible = false;
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.reproducirSonido();
      this.visible = true;
    }, 10); 
  
    setTimeout(() => {
      this.visible = false;
    }, 5000);
  }
  reproducirSonido() {
    const audio = new Audio('assets/sonido/sonido.mp3');
    audio.play();
  }
}
