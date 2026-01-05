import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-alertab',
  standalone: true,
  imports: [],
  templateUrl: './alertab.component.html',
  styleUrl: './alertab.component.scss'
})
export class AlertabComponent {
  datos : any[] = []
  numeroaleatoriomostrar: string = "";
  constructor(private router: Router) {
    const storedData = localStorage.getItem("tsfn");
    this.datos = storedData ? JSON.parse(storedData) : [];
  }
  ngOnInit() {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
    console.log(this.numeroaleatoriomostrar)
  }
  @Input() monto: string = ""
  @Input() numero: any = ""
  @Input() nombre: string = ""
  fechaduplicada: any = ""

  formatearFecha(fechaActual: Date): string {
    const meses = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];

    const dia = this.agregarCeroDelante(fechaActual.getDate());
    const mes = meses[fechaActual.getMonth()];
    const año = fechaActual.getFullYear();
    let hora = fechaActual.getHours();
    const minutos = this.agregarCeroDelante(fechaActual.getMinutes());
    const periodo = hora < 12 ? ' am' : ' pm';

    // Convierte la hora a formato de 1 a 12
    hora = hora % 12 || 12;

    return `${dia} ${mes}. ${año} - ${hora}:${minutos}${periodo}`;
  }
  private capitalizeWords(str: string): string {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    console.log(capitalizedWords)
    return capitalizedWords.join(" ");
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  private agregarCeroDelante(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }
  yapeoComponente() {
    const monto = Number(this.monto);
    const numero = this.numero;
    const nombre = this.nombre;
    const numeroaleatoriomostrar = this.numeroaleatoriomostrar
    this.router.navigate(['/yapeo'], { queryParams: { nombre, numero, cantidad: monto ,destino:'Plin', numeroaleatoriomostrar } });
  }
  
}
