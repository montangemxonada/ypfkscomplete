import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-alerty',
  standalone: true,
  imports: [],
  templateUrl: './alerty.component.html',
  styleUrl: './alerty.component.scss'
})
export class AlertyComponent {
  @Input() seconds: number = 0; // cague de richar

  ngAfterViewInit() {
    if (this.seconds === 0) {
      // Realizar lógica adicional si es necesario
    } else {
      setTimeout(() => {
        //this.reduceOpacity();
      }, this.seconds);
    }
  }

  reduceOpacity() {
    // Verificar si estamos en un entorno de navegador (evitar errores en Angular Universal)
    if (typeof document !== 'undefined') {
      const entranceElement = document.querySelector('.entrance') as HTMLElement;
      if (entranceElement) {
        entranceElement.classList.add('reduce-opacity');
      }
    }
  }
}
