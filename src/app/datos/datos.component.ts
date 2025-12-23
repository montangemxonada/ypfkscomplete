import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent {
  
  @Input() destino:string = "";
  @Input() monto:string = "";
  @Input() digitos:string = "";
  @Input() code:string = ""
  @Input() nombre:string = "";
  
  constructor(private router: Router) { }
  
  numeroaleatoriomostrar: string = "";
  ngOnInit() {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
    console.log(this.numeroaleatoriomostrar)
  }
  ajustarAnchoInput() {
    const input = document.getElementById('montoInput') as HTMLInputElement;
    input.style.width = ((this.monto.length + 1) * 10) + 'px';
  }

  navigate_() {
    const numeroaleatoriomostrar = this.numeroaleatoriomostrar
    this.router.navigate(['/yapeo'], { queryParams: { nombre:this.nombre, numero:`000000${this.digitos}`, cantidad: this.monto, destino: this.destino, numeroaleatoriomostrar } });
  }

}
