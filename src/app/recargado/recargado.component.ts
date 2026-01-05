import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recargado',
  standalone: true,
  imports: [],
  templateUrl: './recargado.component.html',
  styleUrl: './recargado.component.scss'
})
export class RecargadoComponent {
  numero: any = "";
  nombre: string = "";
  cantidad: string = "";
  numeroaleatoriomostrar: string = "";
  fecha: string = ""
  datos: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router) {
    const storedData = localStorage.getItem("nwval");
    this.datos = storedData ? JSON.parse(storedData) : [];
    this.formatearFecha()
  }
  generarNumeroAleatorio(): void {
    const numeroAleatorio = Math.floor(Math.random() * 100000).toString().padStart(4, '0');
    this.numeroaleatoriomostrar = '000'+numeroAleatorio;
  }
  destino:string= ''
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      
      this.numero = params['numero'];
      this.numero = this.formatearNumero()
      this.destino = params['destino'];

      if(params['cantidad'].includes(".")){
        this.cantidad = this.formatearCantidad(params['cantidad']);
      } else {
        this.cantidad = params['cantidad'];
      }
    });
    
    const dinero  = this.paraFloatxd(localStorage.getItem("monto"));
    localStorage.setItem("monto",String(dinero - this.paraFloatxd(this.cantidad)));

    this.guardarValoresEnLocalStorage();
    this.generarNumeroAleatorio()
  }

  paraFloatxd(value:any):any{
    if(value){
      return parseFloat(value)
    }
  }

  private guardarValoresEnLocalStorage(): void {
    const valoresFormateados = {
      numero: this.numero,
      nombre: this.nombre,
      cantidad: this.cantidad
    };

    localStorage.setItem("nwval", JSON.stringify(valoresFormateados));
  }
  
  private formatearCantidad(cantidad: string): string {
    const cantidadNumerica = parseFloat(cantidad);
  
    if (!isNaN(cantidadNumerica)) {
      const cantidadFormateada = cantidadNumerica.toFixed(2);
      return cantidadFormateada;
    } else {
      return cantidad;
    }
  }


  formatearFecha(): void {
    const fechaActual = new Date();
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

    this.fecha = `${dia} ${mes}. ${año} - ${hora}:${minutos}${periodo}`;
  }

  private agregarCeroDelante(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  formatearNumero(): string {
    const numeroComoCadena = String(this.numero).replace(/\s/g, '');
    const numeroFormateado = numeroComoCadena.replace(/(\d{3}|\D{3}(?=\D))/g, '$1 ');
    return numeroFormateado;
  }

  nuevaRecarga(){
    this.router.navigate(['/recargar'])
  }
  inicioComponente() {
    this.router.navigate(['/home']);
  }
}
