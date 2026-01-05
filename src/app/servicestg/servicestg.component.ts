import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type ServiceItem = {
  title: string;
  desc: string;
  tag?: string;
  icon?: 'bolt' | 'bell' | 'support' | 'link';
};

@Component({
  selector: 'app-servicestg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicestg.component.html',
  styleUrl: './servicestg.component.scss'
})
export class ServicestgComponent {
  back(){ history.back(); }

  items: ServiceItem[] = [
    { title: 'Pagos / Cobros', desc: 'Crea flujos, links, y automatiza cobros.', tag: 'STG', icon: 'bolt' },
    { title: 'Notificaciones', desc: 'Programación inteligente y plantillas.', tag: 'STG', icon: 'bell' },
    { title: 'Soporte', desc: 'Atajos a canales y ayuda rápida.', tag: 'STG', icon: 'support' },
    { title: 'Enlaces útiles', desc: 'Accesos rápidos para tu operación.', tag: 'STG', icon: 'link' },
  ];
}
