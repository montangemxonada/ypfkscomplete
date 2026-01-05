import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recargar',
  standalone: true,
  imports: [],
  templateUrl: './recargar.component.html',
  styleUrl: './recargar.component.scss'
})
export class RecargarComponent {
  numero:string = ""
  constructor (private router: Router,) {}
  confirmar() {
    this.router.navigate(['/recmonto']); 
  }
  home(){
    this.router.navigate(['/home']); 
  }
  onChangeNumber(event: any) {
    this.numero = event.target.value.toString();
  }
  movistar() {
    const numero = this.numero
    const destino = 'Movistar'
    const queryParams = { destino, numero: `${numero}` };
    this.router.navigate(['/recmonto'], { queryParams });
  }
  claro() {
    const numero = this.numero
    const destino = 'Claro'
    const queryParams = { destino, numero: `${numero}` };
    this.router.navigate(['/recmonto'], { queryParams });
  }
  entel() {
    const numero = this.numero
    const destino = 'Entel'
    const queryParams = { destino, numero: `${numero}` };
    this.router.navigate(['/recmonto'], { queryParams });
  }
  bitel() {
    const numero = this.numero
    const destino = 'Bitel'
    const queryParams = { destino, numero: `${numero}` };
    this.router.navigate(['/recmonto'], { queryParams });
  }
}
