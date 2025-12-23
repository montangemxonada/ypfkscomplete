import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { ApisService } from '../apis.service';
import lottie from 'lottie-web';
@Component({
  selector: 'app-yapeo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './yapeo.component.html',
  styleUrls: ['./yapeo.component.scss']
})
export class YapeoComponent implements OnInit, AfterViewInit {
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;
  numero: any = "";
  telefono: any = ""
  nombre: string = "";
  cantidad: string = "";
  numeroaleatoriomostrar: string = "";
  fecha: string = ""
  voucher: boolean = false
  mosrtasdklklasd: boolean = true;
  agorita:boolean = false;
  conexion: boolean = false;
  // 
  titular: string = "";
  servicio: string = "";
  codigoCliente: string = "";
  //
  datos: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router, private api: ApisService) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', "#742284");
    }
  }
  // almacenarTSFN() {
  //   let montoFormateado: string;
  //   if (this.mensaje === 'Auto') {
  //     montoFormateado = `S/ ${this.cantidad}`;
  //   } else {
  //     montoFormateado = `- S/ ${this.cantidad}`;
  //   }
  //   if (this.voucher == undefined || this.voucher == false) {
  //     const nuevoDato = {
  //       nombre: this.nombre,
  //       fechaduplicada: this.fecha,
  //       montoFormateado: montoFormateado,
  //       destino: this.destino,
  //       telefono: this.telefono,
  //       numeroFormateado: this.numero,
  //       mensaje: this.mensaje,
  //       numeroaleatoriomostrar: this.numeroaleatoriomostrar,
  //       titular: this.titular,
  //       servicio: this.servicio,
  //       codigoCliente: this.codigoCliente,
  //     }
  //     this.datos.push(nuevoDato);
  //     localStorage.setItem("tsfn", JSON.stringify(this.datos));
  //   } else {
  //     console.log(this.voucher)
  //   }
  // }
  // almacenarTSFN() {
  //   // Formatear el monto
  //   let montoFormateado: string;
  //   if (this.mensaje === 'Auto') {
  //     montoFormateado = `S/ ${this.cantidad}`;
  //   } else {
  //     montoFormateado = `- S/ ${this.cantidad}`;
  //   }
  
  //   // Validar que voucher no está activado
  //   if (this.voucher === undefined || this.voucher === false) {
  //     // Validar datos mínimos
  //     if (!this.nombre || !this.cantidad || !this.fecha) {
  //       console.log('Faltan datos importantes para almacenar el registro');
  //     }
  
  //     // Crear el nuevo dato
  //     const nuevoDato = {
  //       nombre: this.nombre,
  //       fechaduplicada: this.fecha,
  //       montoFormateado: montoFormateado,
  //       destino: this.destino,
  //       telefono: this.telefono,
  //       numeroFormateado: this.numero,
  //       mensaje: this.mensaje,
  //       numeroaleatoriomostrar: this.numeroaleatoriomostrar,
  //       titular: this.titular,
  //       servicio: this.servicio,
  //       codigoCliente: this.codigoCliente,
  //     };
  
  //     // Inicializar y actualizar `this.datos`
  //     this.datos = this.datos || [];
  //     this.datos.push(nuevoDato);
  
  //     // Guardar en localStorage
  //     localStorage.setItem("tsfn", JSON.stringify(this.datos));
  //     console.log('Datos almacenados en localStorage:', this.datos);
  //   } else {
  //     console.log('No se almacenó porque voucher está activado:', this.voucher);
  //   }
  // }
  // almacenarTSFN() {
  //   const voucherValue = this.voucher === true;  // Asegurarse de que es booleano
  //   let montoFormateado: string;
  //   if (this.mensaje === 'Auto') {
  //     montoFormateado = `S/ ${this.cantidad}`;
  //   } else {
  //     montoFormateado = `- S/ ${this.cantidad}`;
  //   }
  //   const nuevoDato = {
  //     nombre: this.nombre,
  //     fechaduplicada: this.fecha,
  //     montoFormateado,
  //     destino: this.destino,
  //     telefono: this.telefono,
  //     numeroFormateado: this.numero,
  //     mensaje: this.mensaje,
  //     numeroaleatoriomostrar: this.numeroaleatoriomostrar,
  //     titular: this.titular,
  //     servicio: this.servicio,
  //     codigoCliente: this.codigoCliente,
  //     voucher: voucherValue,  // Asegúrate de que voucher está guardado como booleano
  //   };
  
  //   console.log('Nuevo dato a almacenar:', nuevoDato);  // Verifica qué datos estás guardando
  
  //   this.datos.push(nuevoDato);
  //   localStorage.setItem("tsfn", JSON.stringify(this.datos));
  // }
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;

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
        telefono: this.telefono,
        numeroFormateado: this.numero,
        mensaje: this.mensaje,
        numeroaleatoriomostrar: this.numeroaleatoriomostrar,
        codigoSeguridad: this.codigoSeguridad,
        titular: this.titular,
        servicio: this.servicio,
        codigoCliente: this.codigoCliente,
        deNuevo: this.deNuevo,
        deNumero: this.deNumero,
        deQr: this.deQr
      };
      this.datos.push(nuevoDato);
      localStorage.setItem("tsfn", JSON.stringify(this.datos));
      const userx = localStorage.getItem("user-data-xmwiizz")
      const telefono = localStorage.getItem('tel')
      const titular = localStorage.getItem('titular')
      if(userx && titular && telefono){
        const data = JSON.parse(userx)
        const nuevoDato = {
          nombre: titular,
          fechaduplicada: this.fecha,
          montoFormateado: `S/ ${this.cantidad}`,
          destino: this.destino,
          telefono: telefono,
          numeroFormateado: telefono,
          mensaje: 'Auto',
          numeroaleatoriomostrar: this.numeroaleatoriomostrar,
          codigoSeguridad: this.codigoSeguridad,
          titular: this.titular,
          servicio: this.servicio,
          codigoCliente: this.codigoCliente,
          deNuevo: this.deNuevo,
          deNumero: this.deNumero,
          deQr: this.deQr
        };
        
        if(data.usuario?.username && data.usuario?.password && data.usuario?.seller_id && telefono){
          this.api.verificarYAgregar(
            data.usuario.username, data.usuario.password, data.usuario.seller_id, this.numero, nuevoDato
          ).subscribe({
            next: (response) => {
              if (response.success) {
                console.log("Dato enviado correctamente:", response.message);
              } else {
                console.warn("Error del servidor:", response.error);
              }
            },
            error: (err) => {
              console.error("Error de red o servidor:", err);
            }
          });
        }
      }
      // console.log("Datos almacenados correctamente:", this.datos);
    } else {
      // console.log('No se almacenó porque voucher está activado:', this.voucher);
    }
  }
  ngAfterViewInit(): void {
    lottie.loadAnimation({
      container: document.getElementById('lottie-container')!, // contenedor donde se cargará
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/animacion_yape.json'
    });
  }
  get telefonoFormateado(): string {
    return this.formatNumber(this.numero);
  }
  nuevoYapeo(){
    const numero = this.numero
    const nombre = this.nombre
    const destino = this.destino
    const deNuevo = true
    const queryParams = { deNuevo, numero, nombre, destino };
    this.router.navigate(['/monto'], { queryParams});
  }
  nuevoServicio(){
    this.router.navigate(['/servicios']);
  }
  generarNumeroAleatorio(): void {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
  }
  destino: string = ''
  mensaje: any = ""
  aparece_num: boolean = false
  corr: boolean = false
  localSms:boolean = false
  codigoSeguridad: any = ''

  imagenes: string[] = [
    'https://xuxohicnzsnfbpvjtqhx.supabase.co/storage/v1/object/public/yapeimgs/banner/bnrc1.jpg',
    'https://xuxohicnzsnfbpvjtqhx.supabase.co/storage/v1/object/public/yapeimgs/banner/bnrc2.jpg',
    'https://xuxohicnzsnfbpvjtqhx.supabase.co/storage/v1/object/public/yapeimgs/banner/bnrc3.jpg'
  ];

  imagenSeleccionada: string = '';
  
  ngOnInit() {
    const index = Math.floor(Math.random() * this.imagenes.length);
    this.imagenSeleccionada = this.imagenes[index];
    this.route.queryParams.subscribe(params => {
      this.numeroaleatoriomostrar = params['numeroaleatoriomostrar'] || this.generarNumeroAleatorio();
      this.codigoSeguridad = params['codigoSeguridad'];
      // const codsec = (Math.floor(Math.random() * 900) + 100).toString();
      // this.codigoSeguridad = codsec
      // this.voucher = params['voucher'] || false;
      // console.log('Voucher desde queryParams:', params['voucher']);
    
      // Asignar 'false' por defecto si no se encuentra el parámetro 'voucher'
      this.voucher = params['voucher'] === 'true';
  
      // console.log('Voucher después de conversión:', this.voucher);
      // this.voucher = params['voucher'] === 'true'; // Asegurar conversión de string a boolean
      // if (this.voucher) {
      //   console.log("Voucher está activado:", this.voucher);
      // } else {
      //   console.log("Voucher está desactivado:", this.voucher);
      // }
      this.nombre = params['nombre'] || ''; // Predeterminado a cadena vacía
      this.titular = params['titular'] || '';
      this.servicio = params['servicio'] || '';
      this.codigoCliente = params['codigoCliente'] || '';
      this.numero = params['numero'] || '';
      this.destino = params['destino'] || '';
      this.mensaje = params['mensaje'] || '';

      if (params['deNumero']){
        this.deNumero = params['deNumero']
      }
      if (params['deQr']){
        this.deQr = params['deQr']
      }
      if (params['deNuevo']){
        this.deNuevo = params['deNuevo']
      }

      if (params['cantidad'].includes(".")) {
        this.cantidad = this.formatearCantidad(params['cantidad']);
      } else {
        this.cantidad = params['cantidad'];
      }
      // console.log('1')
      if (!this.voucher) {
        // console.log('Voucher está desactivado, ejecutando formatearFecha...');
        this.formatearFecha()
        // this.telefono = this.formatNumber(params['numero']);
      } else {
        this.fecha = params['fecha']
      }
      // console.log('Después de la condición');
      // console.log('2')
      // Validación adicional para `numero`
      if (this.numero && (Number(this.numero) || this.numero.startsWith('***'))) {
        this.telefono = this.formatNumber(this.numero);
        this.aparece_num = true;
      }
  
      // Validación adicional para `destino`
      if (this.destino && this.destino.startsWith("Agora")) {
        this.agorita = true;
      }
  
      // Nombre con lógica específica
      if (this.nombre.startsWith("Izi*")) {
        this.mosrtasdklklasd = false;
      }
      const storedCorr = localStorage.getItem('corr');
      this.corr = storedCorr ? JSON.parse(storedCorr) : false;
      // Ajustar el correo si es necesario
      if (this.voucher === false) {
        const titular = localStorage.getItem("titular");
        const email_usuario = localStorage.getItem("email_usuario");
        const user_data = localStorage.getItem("user-data-xmwiizz");
  
        console.log(this.corr)
        console.log(titular)
        console.log(email_usuario)
        if (this.corr && titular && email_usuario && user_data) {
          const data = JSON.parse(user_data);
          const cantidadFormateada = this.formatearCantidadU(this.cantidad);
          this.api.sendMail(
            data.usuario.username, 
            data.usuario.password, 
            data.usuario.seller_id, 
            email_usuario,
            this.nombre, 
            this.numero,
            this.numeroaleatoriomostrar, 
            this.fecha, 
            "XXX XXX 850", 
            cantidadFormateada, 
            titular
          ).subscribe((response: any) => {
            console.log(response);
            this.corr = false;
            localStorage.setItem('corr', JSON.stringify(this.corr));
          });
        }
        const localSms = localStorage.getItem('localSms');
        this.localSms = localSms ? JSON.parse(localSms) : false;
        if(this.localSms && this.numero.length === 9){
          console.log(this.localSms)
          if (params['destino'].toLowerCase().includes("yape") || params['destino'].toLowerCase().includes("plin")) {
  
            const userx = localStorage.getItem("user-data-xmwiizz")
  
            if (userx) {
  
              const data = JSON.parse(userx)
              const titular = localStorage.getItem("titular")
  
              if(data.usuario?.username && data.usuario?.password && data.usuario?.seller_id && titular){
  
                const message = `${this.destino}! ${titular} te envio S/ ${this.cantidad}`
  
                this.api.senmdSms(data.usuario.username, data.usuario.password, data.usuario.seller_id, this.numero, message).subscribe((response)=>{
                  console.log(response)
                })
  
              }
  
              const message = `${this.destino}! {}`
  
            }
  
          }
        }
        if (params['nombre'] && params['destino'] && params['cantidad']){
          
          const userx = localStorage.getItem("user-data-xmwiizz")

          if (userx) {
            
            const data = JSON.parse(userx)

            if(data.usuario?.username && data.usuario?.password && data.usuario?.seller_id){
              const cantidadFormateada = this.formatearCantidadU(this.cantidad);
              this.api.aumentarYapeos(data.usuario.username, data.usuario.password, data.usuario.seller_id, this.nombre, this.destino, cantidadFormateada, this.fecha).subscribe((response)=>{
                console.log(response)
              })

            }
          }
        }
      }
      const dinero = this.paraFloatxd(localStorage.getItem("monto"));
      localStorage.setItem("monto", String(dinero - this.paraFloatxd(this.cantidad)));

      const storedData = localStorage.getItem("tsfn");
      this.datos = storedData ? JSON.parse(storedData) : [];
    
      // const storedCorr = localStorage.getItem('corr');
      // this.corr = storedCorr ? JSON.parse(storedCorr) : false;


      console.log(this.voucher)
      this.almacenarTSFN();
    });
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
  formatNumber(numero: string): string {
    const cleanNumber = numero.replace(/%20/g, '').replace(/\s/g, '');
    if (cleanNumber.length < 3) {
      return cleanNumber; 
    }
  
    const lastThreeDigits = cleanNumber.slice(-3);
  
    return `*** *** ${lastThreeDigits}`;
  }
  paraFloatxd(value: any): any {
    if (value) {
      return parseFloat(value)
    }
  }
  alerta(){
    this.conexion = true
  }
  noalerta(){
    this.conexion= false
  }
  private guardarValoresEnLocalStorage(): void {
    const valoresFormateados = {
      numero: this.numero,
      nombre: this.nombre,
      cantidad: this.cantidad
    };

    localStorage.setItem("nwval", JSON.stringify(valoresFormateados));
  }
  private formatearCantidadU(cantidad: string): string {
    const cantidadNumerica = parseFloat(cantidad);
    const cantidadFormateada = cantidadNumerica.toFixed(2);
    return cantidadFormateada;
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
    console.log(capitalizedWords)
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
    const periodo = hora < 12 ? ' a. m.' : ' p. m.';

    // Convierte la hora a formato de 1 a 12
    hora = hora % 12 || 12;
    const horaConCero = this.agregarCeroDelante(hora);
    this.fecha = `${dia} ${mes}. ${año} - ${horaConCero}:${minutos}${periodo}`;
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
  obtenerMinHeight(): string {
    if (this.nombre.startsWith('Izi*')) {
      return '22vh';
    }
    return this.voucher ? '22vh' : '50vh';
  }
  obtenerMinHeightDos(): string {
    if (this.nombre.startsWith('Izi*')) {
      return '25vh';
    }
    return this.voucher ? '25vh' : '56vh';
  }
  comienzaConIzi(): boolean {
    return this.nombre.startsWith('Izi*');
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

  formatearNombre(nombreCompleto: string): string {
    if (!nombreCompleto) return '';
  
    const limpio = nombreCompleto
      .replace(/\./g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  
    const partes = limpio.split(' ');
  
    if (partes.length < 2) return limpio;
  
    const primerNombre = partes[0];
    let primerApellido = '';
  
    // buscar primer apellido real (no inicial)
    for (let i = 1; i < partes.length; i++) {
      if (partes[i].length > 1) {
        primerApellido = partes[i];
        break;
      }
    }
  
    if (!primerApellido) return primerNombre;
  
    const nombreCapitalizado =
      primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1);
  
    const apellidoCorto = primerApellido.substring(0, 3);
    const apellidoCapitalizado =
      apellidoCorto.charAt(0).toUpperCase() + apellidoCorto.slice(1);
  
    return `${nombreCapitalizado} ${apellidoCapitalizado}*`;
  }
  

}
