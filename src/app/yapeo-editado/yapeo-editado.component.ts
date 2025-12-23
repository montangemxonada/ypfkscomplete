import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-yapeo-editado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './yapeo-editado.component.html',
  styleUrl: './yapeo-editado.component.scss'
})
export class YapeoEditadoComponent {
  numero: any = "";
  nombre: string = "";
  cantidad: string = "";
  numeroaleatoriomostrar: string = "";
  fecha: string = ""
  datos: any[] = [];
  voucher: boolean = false
  mosrtasdklklasd: boolean = true;
  agorita:boolean = false;
  conexion: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', "#742284");
    }
  }
  alerta(){
    this.conexion = true
  }
  noalerta(){
    this.conexion= false
  }
  almacenarTSFN() {
    let montoFormateado: string;
    if (this.mensaje === 'Auto') {
      montoFormateado = `S/ ${this.cantidad}`;
    } else {
      montoFormateado = `- S/ ${this.cantidad}`;
    }
    if (this.voucher == undefined || this.voucher == false) {
      const nuevoDato = {
        nombre: this.nombre,
        fechaduplicada: this.fecha,
        montoFormateado: montoFormateado,
        destino: this.destino,
        numeroFormateado: this.numero,
        numeroaleatoriomostrar: this.numeroaleatoriomostrar,
        mensaje: this.mensaje
      }
      this.datos.push(nuevoDato);
      localStorage.setItem("tsfn", JSON.stringify(this.datos));
    } else {
    }
  }
  nuevoYapeo(){
    const numero = this.numero
    const nombre = this.nombre
    const queryParams = { numero, nombre };
    this.router.navigate(['/monto'], { queryParams});
  }
  generarNumeroAleatorio(): void {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
  }
  destino: string = ''
  mensaje: any = ""
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      
      
      this.numero = params['numero'];
      this.numeroaleatoriomostrar = params['numeroaleatoriomostrar']
      this.numero = this.formatearNumero()

      this.destino = params['destino'];
      if(this.destino.startsWith("Agora")){
        this.agorita = true
      }
      this.voucher = params['voucher']

      this.fecha = params['fecha']
      
      if (params['nombre'] && params['nombre'].startsWith("Izi*")) {

        this.nombre = params['nombre']
        this.mosrtasdklklasd = false

      } else {
        this.nombre = this.capitalizeWords(params['nombre']);
      }

      this.mensaje = params['mensaje']

      if (params['cantidad'].includes(".")) {
        this.cantidad = this.formatearCantidad(params['cantidad']);
      } else {
        this.cantidad = params['cantidad'];
      }
    });

    const dinero = this.paraFloatxd(localStorage.getItem("monto"));
    localStorage.setItem("monto", String(dinero - this.paraFloatxd(this.cantidad)));

    const storedData = localStorage.getItem("tsfn");
    this.datos = storedData ? JSON.parse(storedData) : [];

    this.guardarValoresEnLocalStorage();
    this.generarNumeroAleatorio()

    this.almacenarTSFN()

  }
  separarFecha(fecha: string, parte: number): string {
    if (!fecha) return '';
    
    const partes = fecha.split(' - ');
    
    if (parte === 1) return partes[0]?.trim() || '';
    if (parte === 2) return partes[1]?.trim() || '';
    
    return fecha;
  }
  codSeg(codigoSeguridad: string, tipo: number){
    if (!codigoSeguridad) return '';
    const length = codigoSeguridad.length;
    
    if (tipo === 1) return length >= 1 ? codigoSeguridad[length - 3] || '4' : '4';
    if (tipo === 2) return length >= 2 ? codigoSeguridad[length - 2] || '9' : '9';
    if (tipo === 3) return length >= 3 ? codigoSeguridad[length - 1] || '2' : '2';
    return '';  
  }
  paraFloatxd(value: any): any {
    if (value) {
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
  private capitalizeWords(str: string): string {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    return capitalizedWords.join(" ");
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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
    let ultimosTresDigitos: string = this.numero.slice(-3);
    return `*** *** ${ultimosTresDigitos}`;
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
  inicioComponente() {
    this.router.navigate(['/home']);
  }
  capturarYCompartir() {
    const elementoCapturar = document.querySelector('div[style="display: grid; justify-content: center;"]');

    if (elementoCapturar) {
      // Asegúrate de que el tipo sea HTMLElement
      const elementoHTML = elementoCapturar as HTMLElement;

      html2canvas(elementoHTML).then((canvas: any) => {
        const dataUrl = canvas.toDataURL('image/png');

        // Crear un elemento a con el enlace de descarga de la captura
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'captura.png';
        document.body.appendChild(link);

        // Simular un clic en el enlace para descargar la captura
        link.click();

        // Eliminar el elemento a después de descargar la captura
        document.body.removeChild(link);
      });
    } else {
      console.error('Elemento no encontrado. No se puede capturar y compartir.');
    }
  }
}
