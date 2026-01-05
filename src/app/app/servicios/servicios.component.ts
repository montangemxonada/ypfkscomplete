import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreloadComponent } from '../preload/preload.component';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, PreloadComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {
  constructor(public router: Router,
    private route: ActivatedRoute) { }
    nombre: string = ""
    monto: any = null;
    titular: string = ""
    servicio: string = ""
    codigoCliente: string = ""
    fechaduplicada: string = '';
    botonesHabilitados: boolean = false;
    // voucher: boolean = false
    numeroaleatoriomostrar: string = "";
    mostrarPreload: boolean = false
    onChangeMonto(event: any) {
      this.monto = Number(event.target.value);
      // this.actualizarBotones();
    }
    onChangeNombre(event: any ) {
      this.nombre = event.target.value
    }
    onChangeTitular(event: any ) {
      this.titular = event.target.value
    }
    onChangeServicio(event: any){
      this.servicio = event.target.value
    }
    onChangeCodigo(event: any){
      this.codigoCliente = event.target.value
    }
    actualizarBotones() {
      this.botonesHabilitados = this.monto > 0;
    }
    ngOnInit() {      
      const numeroAleatorio = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      this.numeroaleatoriomostrar = '0' + numeroAleatorio;
      console.log(this.numeroaleatoriomostrar)

      const fechaActual = new Date();
      this.formatearFecha(fechaActual);
    }
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
    voucher: boolean= false
    yapeoComponent(monto: number) {
      const fecha = new Date().toISOString();
      const nombre = this.nombre;
      const titular = this.titular
      const servicio = this.servicio
      const codigoCliente = this.codigoCliente
      const numeroaleatoriomostrar = this.numeroaleatoriomostrar
      const mensaje = ''
      this.mostrarPreload = true
      const voucher = this.voucher ?? false;
      setTimeout(() => {
        this.mostrarPreload = false
        this.router.navigate(['/yapeo'], { queryParams: { nombre, titular, servicio, codigoCliente, cantidad: monto, numeroaleatoriomostrar, mensaje , voucher} });
      }, 2000)
    }
}
