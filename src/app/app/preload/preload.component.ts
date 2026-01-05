import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-preload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preload.component.html',
  styleUrl: './preload.component.scss'
})
export class PreloadComponent implements AfterViewInit {
  @Input() seconds: number = 2000; // cague de richar
  @Input() palabra: string = ""
  
  ngAfterViewInit() {
    if (this.seconds === 0) {
      // Realizar lógica adicional si es necesario
    } else {
      setTimeout(() => {
        this.reduceOpacity();
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