import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-recmonto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recmonto.component.html',
  styleUrl: './recmonto.component.scss'
})
export class RecmontoComponent {

  constructor(private route: ActivatedRoute, private router: Router, private api: ApisService) {
    const storedData = localStorage.getItem("tsfn");
    this.datos = storedData ? JSON.parse(storedData) : [];
  }

  monto: any = null;
  botonesHabilitados: boolean = false;
  numero: any = null
  destino: any = null

  fechaActual: string = '';
  fechaduplicada: string = '';
  ngOnInit() {
    const dinero = Number(localStorage.getItem("monto"));
    console.log(dinero)
    localStorage.setItem("monto", String(dinero - Number(this.monto)) + '.00');

    console.log(localStorage.getItem("monto"))

    this.route.queryParams.subscribe(params => {
      this.numero = params['numero'];

      this.destino = params['destino']

    });
    console.log(this.numero)
    console.log(this.destino)
    const fechaActual = new Date();
    this.formatearFecha(fechaActual);
  }
  actualizarBotones() {
    this.botonesHabilitados = this.monto > 0;
  }
  home() {
    this.router.navigate(['/home']);
  }
  atras() {
    this.router.navigate(['/recargar']);
  }
  yapeoComponente() {
    this.router.navigate(['/yapeo']);
  }
  datos: any[] = [];

  yapeoComponent(monto: number) {
    const fecha = new Date().toISOString();
    const numero = this.numero;
    const montoFormateado = '- S/' + monto.toFixed(2)
    let numeroFormateado = 'Recarga a ' + this.formatearNumero();
    const destino = this.destino
    console.log(`destino: ${this.destino}`)



    const nuevoDato = {
      numero,
      numeroFormateado,
      fechaduplicada: this.fechaduplicada,
      montoFormateado
    };

    this.datos.push(nuevoDato);
    localStorage.setItem("tsfn", JSON.stringify(this.datos));

 
    this.router.navigate(['/recargado'], { queryParams: {numero, cantidad: monto, destino } });
  }

  //
  formatearFecha(fechaActual: Date): void {
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

    this.fechaduplicada = `${dia} ${mes}. ${año} - ${hora}:${minutos}${periodo}`;
  }

  private agregarCeroDelante(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }
  formatearNumero(): string {
    const numeroComoCadena = String(this.numero).replace(/\s/g, '');
    const numeroFormateado = numeroComoCadena.replace(/(\d{3}|\D{3}(?=\D))/g, '$1 ');
    return numeroFormateado;
}
  private agregarEspacios(valor: number): string {
    const valorString = valor.toString();
    const longitud = valorString.length;
    let resultado = '';

    for (let i = 0; i < longitud; i++) {
      resultado += valorString[i];
      if (i < longitud - 1 && (longitud - i - 1) % 3 === 0) {
        resultado += ' ';
      }
    }

    return resultado;
  }
}
