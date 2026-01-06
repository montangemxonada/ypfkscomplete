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
    { title: 'Pagos / Cobros', desc: '...', tag: 'STG', icon: 'bolt' },
    { title: 'Notificaciones', desc: '....', tag: 'STG', icon: 'bell' },
    { title: 'Soporte', desc: '...', tag: 'STG', icon: 'support' },
    { title: 'Enlaces útiles', desc: '...', tag: 'STG', icon: 'link' },
  ];
}
