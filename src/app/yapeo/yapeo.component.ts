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
  telefono: any = "";
  nombre: string = "";          // lo que llega por queryParams (lo mantengo por compatibilidad)
  cantidad: string = "";
  numeroaleatoriomostrar: string = "";
  fecha: string = "";
  voucher: boolean = false;
  mosrtasdklklasd: boolean = true;
  agorita: boolean = false;
  conexion: boolean = false;

  // Servicios
  titular: string = "";
  servicio: string = "";
  codigoCliente: string = "";

  // Para historial TSFN
  datos: any[] = [];

  // Flags origen
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;

  // ===== ✅ COORDINACIÓN NOMBRE (nuevo) =====
  nombreFull: string = "";
  nombreResumido: string = "";
  mostrarNombreCompleto: boolean = false;
  nombreMostrar: string = ""; // ESTE es el que se debe pintar SIEMPRE en el HTML

  destino: string = '';
  mensaje: any = "";
  aparece_num: boolean = false;
  corr: boolean = false;
  localSms: boolean = false;
  codigoSeguridad: any = '';

  imagenes: string[] = [
    'https://xuxohicnzsnfbpvjtqhx.supabase.co/storage/v1/object/public/yapeimgs/banner/bnrc1.jpg',
    'https://xuxohicnzsnfbpvjtqhx.supabase.co/storage/v1/object/public/yapeimgs/banner/bnrc2.jpg',
    'https://xuxohicnzsnfbpvjtqhx.supabase.co/storage/v1/object/public/yapeimgs/banner/bnrc3.jpg'
  ];
  imagenSeleccionada: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private api: ApisService) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', "#742284");
    }
  }

  ngAfterViewInit(): void {
    lottie.loadAnimation({
      container: document.getElementById('lottie-container')!,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/animacion_yape.json'
    });
  }

  get telefonoFormateado(): string {
    return this.formatNumber(this.numero);
  }

  nuevoYapeo() {
    const numero = this.numero;
    const nombre = this.nombre;
    const destino = this.destino;
    const deNuevo = true;
    const queryParams = { deNuevo, numero, nombre, destino };
    this.router.navigate(['/monto'], { queryParams });
  }

  nuevoServicio() {
    this.router.navigate(['/servicios']);
  }

  generarNumeroAleatorio(): void {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
  }

  ngOnInit() {
    const index = Math.floor(Math.random() * this.imagenes.length);
    this.imagenSeleccionada = this.imagenes[index];

    this.route.queryParams.subscribe(params => {
      this.numeroaleatoriomostrar = params['numeroaleatoriomostrar'] || this.generarNumeroAleatorio();
      this.codigoSeguridad = params['codigoSeguridad'];

      // voucher viene string "true"/"false"
      this.voucher = params['voucher'] === 'true';

      // base
      this.nombre = params['nombre'] || '';
      this.titular = params['titular'] || '';
      this.servicio = params['servicio'] || '';
      this.codigoCliente = params['codigoCliente'] || '';
      this.numero = params['numero'] || '';
      this.destino = params['destino'] || '';
      this.mensaje = params['mensaje'] || '';

      // ===== ✅ Flags (convertir a boolean real) =====
      this.deNumero = params['deNumero'] === true || params['deNumero'] === 'true';
      this.deQr     = params['deQr'] === true || params['deQr'] === 'true';
      this.deNuevo  = params['deNuevo'] === true || params['deNuevo'] === 'true';

      // ===== ✅ COORDINACIÓN NOMBRE (leer params y decidir) =====
      this.mostrarNombreCompleto =
        params['mostrarNombreCompleto'] === true || params['mostrarNombreCompleto'] === 'true';

      this.nombreFull = (params['nombreFull'] || this.nombre || '').toString();
      this.nombreResumido = (params['nombreResumido'] || this.formatearNombre(this.nombreFull) || '').toString();

      // Si NO vinieron esos params, al menos respeta lo que venga en "nombre"
      // y úsalo como nombreMostrar para no re-transformar.
      if (!params['nombreFull'] && !params['nombreResumido'] && params['nombre']) {
        this.nombreMostrar = this.nombre;
      } else {
        this.nombreMostrar = this.mostrarNombreCompleto ? this.nombreFull : this.nombreResumido;
        // Mantener compatibilidad: "nombre" también refleja lo que se muestra
        this.nombre = this.nombreMostrar;
      }

      // monto
      if (params['cantidad']?.includes(".")) {
        this.cantidad = this.formatearCantidad(params['cantidad']);
      } else {
        this.cantidad = params['cantidad'];
      }

      // fecha
      if (!this.voucher) {
        this.formatearFecha();
      } else {
        this.fecha = params['fecha'];
      }

      // telefono mask
      if (this.numero && (Number(this.numero) || this.numero.startsWith('***'))) {
        this.telefono = this.formatNumber(this.numero);
        this.aparece_num = true;
      }

      // Agora
      if (this.destino && this.destino.startsWith("Agora")) {
        this.agorita = true;
      }

      // Izi*
      if (this.nombre.startsWith("Izi*")) {
        this.mosrtasdklklasd = false;
      }

      // corr
      const storedCorr = localStorage.getItem('corr');
      this.corr = storedCorr ? JSON.parse(storedCorr) : false;

      // correo / sms / aumentar yapeos (tu lógica original)
      if (this.voucher === false) {
        const titular = localStorage.getItem("titular");
        const email_usuario = localStorage.getItem("email_usuario");
        const user_data = localStorage.getItem("user-data-xmwiizz");

        if (this.corr && titular && email_usuario && user_data) {
          const data = JSON.parse(user_data);
          const cantidadFormateada = this.formatearCantidadU(this.cantidad);
          this.api.sendMail(
            data.usuario.username,
            data.usuario.password,
            data.usuario.seller_id,
            email_usuario,
            this.nombre, // aquí queda coherente con nombreMostrar
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

        if (this.localSms && this.numero.length === 9) {
          if (params['destino']?.toLowerCase().includes("yape") || params['destino']?.toLowerCase().includes("plin")) {
            const userx = localStorage.getItem("user-data-xmwiizz");
            if (userx) {
              const data = JSON.parse(userx);
              const titular = localStorage.getItem("titular");

              if (data.usuario?.username && data.usuario?.password && data.usuario?.seller_id && titular) {
                const message = `${this.destino}! ${titular} te envio S/ ${this.cantidad}`;
                this.api.senmdSms(data.usuario.username, data.usuario.password, data.usuario.seller_id, this.numero, message)
                  .subscribe((response) => console.log(response));
              }
            }
          }
        }

        if (params['nombre'] && params['destino'] && params['cantidad']) {
          const userx = localStorage.getItem("user-data-xmwiizz");
          if (userx) {
            const data = JSON.parse(userx);
            if (data.usuario?.username && data.usuario?.password && data.usuario?.seller_id) {
              const cantidadFormateada = this.formatearCantidadU(this.cantidad);
              this.api.aumentarYapeos(
                data.usuario.username,
                data.usuario.password,
                data.usuario.seller_id,
                this.nombre,
                this.destino,
                cantidadFormateada,
                this.fecha
              ).subscribe((response) => console.log(response));
            }
          }
        }
      }

      // descontar monto local
      const dinero = this.paraFloatxd(localStorage.getItem("monto"));
      localStorage.setItem("monto", String(dinero - this.paraFloatxd(this.cantidad)));

      // leer TSFN
      const storedData = localStorage.getItem("tsfn");
      this.datos = storedData ? JSON.parse(storedData) : [];

      // almacenar TSFN
      this.almacenarTSFN();
    });
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
        nombre: this.nombre, // ya viene coherente con nombreMostrar
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

      const userx = localStorage.getItem("user-data-xmwiizz");
      const telefono = localStorage.getItem('tel');
      const titular = localStorage.getItem('titular');

      if (userx && titular && telefono) {
        const data = JSON.parse(userx);
        const nuevoDato2 = {
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

        if (data.usuario?.username && data.usuario?.password && data.usuario?.seller_id && telefono) {
          this.api.verificarYAgregar(
            data.usuario.username,
            data.usuario.password,
            data.usuario.seller_id,
            this.numero,
            nuevoDato2
          ).subscribe({
            next: (response) => {
              if (response.success) console.log("Dato enviado correctamente:", response.message);
              else console.warn("Error del servidor:", response.error);
            },
            error: (err) => console.error("Error de red o servidor:", err)
          });
        }
      }
    }
  }

  separarFecha(fecha: string, parte: number): string {
    if (!fecha) return '';
    const partes = fecha.split(' - ');
    if (parte === 1) return partes[0]?.trim() || '';
    if (parte === 2) return partes[1]?.trim() || '';
    return fecha;
  }

  codSeg(codigoSeguridad: string, tipo: number) {
    if (!codigoSeguridad) return '';
    const length = codigoSeguridad.length;
    if (tipo === 1) return length >= 1 ? codigoSeguridad[length - 3] || '4' : '4';
    if (tipo === 2) return length >= 2 ? codigoSeguridad[length - 2] || '9' : '9';
    if (tipo === 3) return length >= 3 ? codigoSeguridad[length - 1] || '2' : '2';
    return '';
  }

  formatNumber(numero: string): string {
    const cleanNumber = numero.replace(/%20/g, '').replace(/\s/g, '');
    if (cleanNumber.length < 3) return cleanNumber;
    const lastThreeDigits = cleanNumber.slice(-3);
    return `*** *** ${lastThreeDigits}`;
  }

  paraFloatxd(value: any): any {
    if (value) return parseFloat(value);
  }

  alerta() {
    this.conexion = true;
  }

  noalerta() {
    this.conexion = false;
  }

  private formatearCantidadU(cantidad: string): string {
    const cantidadNumerica = parseFloat(cantidad);
    return cantidadNumerica.toFixed(2);
  }

  private formatearCantidad(cantidad: string): string {
    const cantidadNumerica = parseFloat(cantidad);
    if (!isNaN(cantidadNumerica)) return cantidadNumerica.toFixed(2);
    return cantidad;
  }

  formatearFecha(): void {
    const fechaActual = new Date();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    const dia = this.agregarCeroDelante(fechaActual.getDate());
    const mes = meses[fechaActual.getMonth()];
    const año = fechaActual.getFullYear();
    let hora = fechaActual.getHours();
    const minutos = this.agregarCeroDelante(fechaActual.getMinutes());
    const periodo = hora < 12 ? ' a. m.' : ' p. m.';

    hora = hora % 12 || 12;
    const horaConCero = this.agregarCeroDelante(hora);
    this.fecha = `${dia} ${mes}. ${año} - ${horaConCero}:${minutos}${periodo}`;
  }

  private agregarCeroDelante(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  inicioComponente() {
    this.router.navigate(['/home']);
  }

  capturarYCompartir() {
    const elementoCapturar = document.querySelector('div[style="display: grid; justify-content: center;"]');
    if (elementoCapturar) {
      const elementoHTML = elementoCapturar as HTMLElement;
      html2canvas(elementoHTML).then((canvas: any) => {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'captura.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } else {
      console.error('Elemento no encontrado. No se puede capturar y compartir.');
    }
  }

  // ===== tu resumidor original (lo dejo por compatibilidad) =====
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

    for (let i = 1; i < partes.length; i++) {
      if (partes[i].length > 1) {
        primerApellido = partes[i];
        break;
      }
    }

    if (!primerApellido) return primerNombre;

    const nombreCapitalizado = primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1);
    const apellidoCorto = primerApellido.substring(0, 3);
    const apellidoCapitalizado = apellidoCorto.charAt(0).toUpperCase() + apellidoCorto.slice(1);

    return `${nombreCapitalizado} ${apellidoCapitalizado}*`;
  }
}
