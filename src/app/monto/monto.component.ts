import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApisService } from '../apis.service';
import { CommonModule } from '@angular/common';
import { PreloadComponent } from '../preload/preload.component';
import { ApiLogService } from '../api-log.service';

@Component({
  selector: 'app-monto',
  standalone: true,
  imports: [FormsModule, CommonModule, PreloadComponent],
  templateUrl: './monto.component.html',
  styleUrl: './monto.component.scss'
})
export class MontoComponent implements OnInit {

  mostrarPreload: boolean = false
  message_type: string = "";

  typeMessage(e: Event): void {
    if (e.target && (e.target as HTMLInputElement).value) {
      this.message_type = (e.target as HTMLInputElement).value;
      console.log(this.message_type)
    } else {
      console.error('No se pudo obtener el valor del evento.');
    }
  }
showFullName: boolean = false;
nombreCompletoBackup: string = '';

toggleNombre(): void {
  // Si no hay backup todavía, NO inventes: usa el nombre actual como último recurso
  if (!this.nombreCompletoBackup) {
    this.nombreCompletoBackup = (this.nombre || '').toString();
  }

  this.showFullName = !this.showFullName;

  // Alterna lo que se VE
  this.nombre = this.showFullName
    ? this.nombreCompletoBackup
    : this.formatReceiverName(this.nombreCompletoBackup);
}

resumirNombre(full: string): string {
  const partes = (full || '').trim().split(/\s+/).filter(Boolean);
  if (partes.length <= 1) return full;
  const first = partes[0];
  const initials = partes.slice(1).map(p => p[0].toUpperCase() + '.').join(' ');
  return `${first} ${initials}`;
}



  constructor(private route: ActivatedRoute, private router: Router, private api: ApisService, private apiLogs: ApiLogService) {

  }

  nombre: any = null;
  monto: any = null;
  botonesHabilitados: boolean = false;
  numero: any = null
  telefono: any = null
  destino: any = null
  numeroaleatoriomostrar: string = "";
  codigoSeguridad: string = ''
  fechaActual: string = '';
  fechaduplicada: string = '';
  place_holder: string = '';

  nombreIniciaConIzi(): boolean {
    return this.nombre.startsWith('Izi*');
  }
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;
  determinarNoD: string = ''
  ngOnInit() {

    const dinero = Number(localStorage.getItem("monto"));
    localStorage.setItem("monto", String(dinero - Number(this.monto)) + '.00');
    const codsec = (Math.floor(Math.random() * 900) + 100).toString();
    this.codigoSeguridad = codsec
    console.log(this.numeroaleatoriomostrar)

    this.route.queryParams.subscribe(params => {
      if(params['deNumero']){
        this.deNumero = true
        
        this.numero = params['numero']
        this.telefono =  this.formatNumber(params['numero']);
        this.destino = 'Yape'
        this.determinarNoD = this.telefono 
        // this.nombre = this.formatReceiverName(this.capitalizeWords(response.receiverName))
        const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.numeroaleatoriomostrar = '01' + numeroAleatorio;
        const full = this.capitalizeWords(params['nombre'] || '');
        this.nombreCompletoBackup = full;  // ✅ siempre full real
        this.showFullName = false;

        if (this.destino === 'Yape') {
          this.nombre = this.formatReceiverName(full);
        } else {
          this.nombre = full; // otros bancos: no resumes
        }
      }
      if(params['deQr']){
        this.deQr = true
        // this.nombre = params['nombre']
        this.numero = params['numero']
        this.destino = params['destino']
        this.determinarNoD = this.destino 
        if(this.destino === 'Yape'){
          this.nombre = this.formatReceiverName(params['nombre'])
          console.log('Nombre Format: ' + this.nombre)
          const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          this.numeroaleatoriomostrar = '01' + numeroAleatorio;
        } else{
          this.nombre = this.capitalizeWords(params['nombre'])
          const numeroAleatorio = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
          this.numeroaleatoriomostrar = numeroAleatorio;
        }
        console.log(this.numeroaleatoriomostrar)
      }
      if(params['deNuevo']){
        this.deNuevo = true
        this.nombre = params['nombre']
        this.numero = params['numero']
        this.telefono =  this.formatNumber(params['numero']);
        this.destino = params['destino']
        this.determinarNoD = this.telefono 

        if(this.destino == 'Yape'){
          this.nombre = this.formatReceiverName(params['nombre'])
          const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          this.numeroaleatoriomostrar = '01' + numeroAleatorio;
          
        } else{
          const numeroAleatorio = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
          this.numeroaleatoriomostrar = numeroAleatorio;
          this.nombre = this.capitalizeWords(params['nombre'])
        }
      }
      
     
      
    });

    const fechaActual = new Date();
    this.formatearFecha(fechaActual);
  }
  formatNumber(numero: string): string {
    // Reemplaza %20 con espacio y elimina todos los espacios
    const cleanNumber = numero.replace(/%20/g, '').replace(/\s/g, '');
  
    // Si el número es menor que 3 dígitos, devuelve tal cual
    if (cleanNumber.length < 3) {
      return cleanNumber; 
    }
  
    // Obtén los últimos 3 caracteres
    const lastThreeDigits = cleanNumber.slice(-3);
  
    // Devuelve el formato "*** *** " + últimos 3 caracteres
    return `*** *** ${lastThreeDigits}`;
  }

  actualizarBotones() {
    this.botonesHabilitados = this.monto > 0;
  }
  consultando: boolean = false;
  getYapeNombre() {
    this.place_holder = ""
    this.consultando = true;
    const userDataString = localStorage.getItem("user-data-xmwiizz")

    if (userDataString) {
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id

      this.api.consultarInformacionYape(this.numero, username, password, seller_id).subscribe(
        (response: any) => {
          console.log(this.numero)
          this.consultando = false;
          const full = this.capitalizeWords(response.receiverName);
          this.nombreCompletoBackup = full;          // ✅ guardar full real
          this.showFullName = false;                 // ✅ default resumido
          this.nombre = this.formatReceiverName(full); // ✅ mostrar resumido
        },
        (error: any) => {

          if(error.status == 429) {

            const tiempo_ahora = error.error.tiempo_ahora
            const tiempo_ultima_consulta = error.error.tiempo_ultima_consulta

            this.consultando = false;
            const tiempoEspera = Math.ceil((tiempo_ahora - tiempo_ultima_consulta) / 60);

            this.place_holder = `[ ESPERE ${tiempoEspera} MINUTOS ]`

          } else {
            this.place_holder = "[ INGRESE EL NOMBRE ]"
          }
        })
    }
  }
  formatReceiverName(name: string): string {
    if (!name) return name;
  
    name = this.capitalizeWords(name);
  
    const words = name
      .replace(/\./g, '')     // quitar puntos
      .replace(/\s+/g, ' ')   // limpiar espacios
      .trim()
      .split(' ');
  
    if (words.length < 2) return name;
  
    const firstName = words[0];
    let firstLastName = '';
  
    // buscar el primer apellido real (no inicial)
    for (let i = 1; i < words.length; i++) {
      if (words[i].length > 1) {
        firstLastName = words[i];
        break;
      }
    }
  
    if (!firstLastName) return firstName;
  
    return `${firstName} ${firstLastName.substring(0, 3)}*`;
  }
  consult(){
    this.consultando = false;
  }
  private capitalizeWords(str: string): string {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    console.log(capitalizedWords)
    return capitalizedWords.join(" ");
  }

  private capitalizeFirstLetter(word: string): string {
    // Convertir solo la primera letra a mayúscula
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  homeComponente() {
    this.router.navigate(['/home']);
  }
  yapearComponente() {
    this.router.navigate(['/yapear']);
  }
  yapeoComponente() {
    this.router.navigate(['/yapeo']);
  }

  
  bancosComponent(monto: number) {
    const deNumero = this.deNumero
    const deNuevo = this.deNuevo
    const deQr = this.deQr
    const numero = this.numero
    const mensaje = this.message_type
    console.log("Mensaje: " + mensaje)
    this.router.navigate(['/bancos-pago'], { queryParams: { numero, monto, mensaje, deNumero, deNuevo, deQr } });
  }

  yapeoComponent(nombre: string, monto: number) {
  const deNumero = this.deNumero;
  const deNuevo = this.deNuevo;
  const deQr = this.deQr;
  const numero = this.numero;
  const telefono = this.telefono;
  const mensaje = this.message_type;
  const numeroaleatoriomostrar = this.numeroaleatoriomostrar;
  const codigoSeguridad = this.codigoSeguridad;
  const destino = this.destino;

  // ✅ COORDINACIÓN NOMBRE (completo vs resumido)
  const nombreFull = (this as any).nombreCompletoBackup || nombre; // si usas backup del toggle
  const nombreResumido = this.formatReceiverName(nombreFull);
  const mostrarNombreCompleto = (this as any).showFullName === true;

  // lo que viaja como "nombre" será EXACTAMENTE lo que quieres mostrar en voucher
  const nombreParaVoucher = mostrarNombreCompleto ? nombreFull : nombreResumido;

  this.mostrarPreload = true;
  setTimeout(() => {
    this.mostrarPreload = false;
    this.router.navigate(['/yapeo'], {
      queryParams: {
        // ✅ nombre que se verá en yapeo
        nombre: nombreParaVoucher,

        // ✅ extra: para que yapeo sepa qué hacer
        nombreFull,
        nombreResumido,
        mostrarNombreCompleto,

        // lo demás igual
        cantidad: monto,
        numero,
        telefono,
        destino,
        mensaje,
        numeroaleatoriomostrar,
        codigoSeguridad,
        deNumero,
        deNuevo,
        deQr
      }
    });
  }, 2000);
}

  bancoComponent(monto: number) {
    const numero = this.numero
    this.router.navigate(['/bancos-pago'], { queryParams: { numero, monto } });
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
  formatearNumero(): string {
    let ultimosTresDigitos: string = this.telefono.slice(-3);
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
}
