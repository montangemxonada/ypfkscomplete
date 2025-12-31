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

  // ===== Base =====
  numero: any = "";
  telefono: any = "";
  nombre: string = "";          // compatibilidad (termina siendo igual a nombreMostrar)
  cantidad: string = "";
  numeroaleatoriomostrar: string = "";
  fecha: string = "";
  voucher: boolean = false;
  mosrtasdklklasd: boolean = true;
  agorita: boolean = false;
  conexion: boolean = false;

  // ===== Servicios =====
  titular: string = "";
  servicio: string = "";
  codigoCliente: string = "";

  // ===== TSFN =====
  datos: any[] = [];

  // ===== Flags origen =====
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;

  // ===== ✅ 3 MODOS NOMBRE =====
  // 0=corto "Rocio Bay*" 1=iniciales "ROCIO J. BAYLON J." 2=completo
  nameMode: 0 | 1 | 2 = 0;

  nombreFull: string = "";
  nombreCorto: string = "";
  nombreIniciales: string = "";
  nombreMostrar: string = "";   // ESTE se pinta en HTML

  // Compat con esquema viejo (2 modos)
  nombreResumido: string = "";
  mostrarNombreCompleto: boolean = false;

  // ===== Otros =====
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

  // ================== NAV ==================
  nuevoYapeo() {
    const numero = this.numero;
    const nombre = this.nombreMostrar || this.nombre;
    const destino = this.destino;
    const deNuevo = true;

    // ✅ reenviar también el estado del nombre (3 modos)
    const queryParams = {
      deNuevo,
      numero,
      destino,
      nombre, // compat

      nombreFull: this.nombreFull,
      nombreCorto: this.nombreCorto,
      nombreIniciales: this.nombreIniciales,
      nameMode: this.nameMode
    };

    this.router.navigate(['/monto'], { queryParams });
  }

  nuevoServicio() {
    this.router.navigate(['/servicios']);
  }

  generarNumeroAleatorio(): string {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
    return this.numeroaleatoriomostrar;
  }

  // ================== INIT ==================
  ngOnInit() {
    const index = Math.floor(Math.random() * this.imagenes.length);
    this.imagenSeleccionada = this.imagenes[index];

    this.route.queryParams.subscribe(params => {
      // ==== base ====
      this.codigoSeguridad = params['codigoSeguridad'];
      this.voucher = params['voucher'] === 'true';

      this.numero = params['numero'] || '';
      this.destino = params['destino'] || '';
      this.mensaje = params['mensaje'] || '';
      this.titular = params['titular'] || '';
      this.servicio = params['servicio'] || '';
      this.codigoCliente = params['codigoCliente'] || '';

      // ==== flags reales ====
      this.deNumero = params['deNumero'] === true || params['deNumero'] === 'true';
      this.deQr     = params['deQr'] === true || params['deQr'] === 'true';
      this.deNuevo  = params['deNuevo'] === true || params['deNuevo'] === 'true';

      // ==== numero aleatorio mostrar ====
      this.numeroaleatoriomostrar = params['numeroaleatoriomostrar'] || this.generarNumeroAleatorio();

      // ==== monto ====
      if (params['cantidad']?.includes(".")) {
        this.cantidad = this.formatearCantidad(params['cantidad']);
      } else {
        this.cantidad = params['cantidad'];
      }

      // ==== fecha ====
      if (!this.voucher) this.formatearFecha();
      else this.fecha = params['fecha'];

      // ==== telefono mask ====
      if (this.numero && (Number(this.numero) || this.numero.startsWith('***'))) {
        this.telefono = this.formatNumber(this.numero);
        this.aparece_num = true;
      }

      // ==== Agora ====
      if (this.destino && this.destino.startsWith("Agora")) this.agorita = true;

      // =========================
      // ✅ NOMBRE: 3 MODOS (nuevo)
      // =========================
      // 1) leer nuevo esquema
      const nameModeParam = params['nameMode'];
      if (nameModeParam !== undefined && nameModeParam !== null && nameModeParam !== '') {
        this.nameMode = Number(nameModeParam) as 0 | 1 | 2;
      } else {
        this.nameMode = 0;
      }

      this.nombreFull = (params['nombreFull'] || '').toString();
      this.nombreCorto = (params['nombreCorto'] || '').toString();
      this.nombreIniciales = (params['nombreIniciales'] || '').toString();

      // 2) compat viejo (2 estados)
      this.mostrarNombreCompleto =
        params['mostrarNombreCompleto'] === true || params['mostrarNombreCompleto'] === 'true';

      this.nombreResumido = (params['nombreResumido'] || '').toString();

      // 3) compat “nombre” suelto
      this.nombre = (params['nombre'] || '').toString();

      // 4) decidir nombreMostrar (prioridad: nuevo 3-modos > viejo 2-modos > nombre directo)
      const tiene3 = !!(this.nombreFull || this.nombreCorto || this.nombreIniciales);

      if (tiene3) {
        // Completar faltantes si llegaron incompletos
        if (!this.nombreFull && this.nombre) this.nombreFull = this.nombre;
        if (!this.nombreCorto && this.nombreFull) this.nombreCorto = this.formatearNombre(this.nombreFull);
        if (!this.nombreIniciales && this.nombreFull) this.nombreIniciales = this.formatoIniciales(this.nombreFull);

        this.nombreMostrar =
          this.nameMode === 0 ? (this.nombreCorto || this.nombreFull || this.nombre) :
          this.nameMode === 1 ? (this.nombreIniciales || this.nombreFull || this.nombre) :
          (this.nombreFull || this.nombre);

      } else if (this.nombreResumido || params['mostrarNombreCompleto'] !== undefined) {
        // esquema viejo
        const full = (params['nombreFull'] || this.nombre || '').toString();
        const resum = (params['nombreResumido'] || this.formatearNombre(full) || '').toString();
        this.nombreMostrar = this.mostrarNombreCompleto ? full : resum;

      } else {
        // último recurso: lo que viene en "nombre"
        this.nombreMostrar = this.nombre;
      }

      // mantener compatibilidad: this.nombre = lo que se muestra
      this.nombre = this.nombreMostrar;

      // Izi*
      if (this.nombre.startsWith("Izi*")) this.mosrtasdklklasd = false;

      // corr
      const storedCorr = localStorage.getItem('corr');
      this.corr = storedCorr ? JSON.parse(storedCorr) : false;

      // ================== MAIL / SMS / AUMENTAR (tu lógica) ==================
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
            this.nombre, // ✅ coherente con nombreMostrar
            this.numero,
            this.numeroaleatoriomostrar,
            this.fecha,
            "XXX XXX 850",
            cantidadFormateada,
            titular
          ).subscribe(() => {
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
                  .subscribe();
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
              ).subscribe();
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

  // ================== TSFN ==================
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
          ).subscribe();
        }
      }
    }
  }

  // ================== HELPERS ==================
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
    const cleanNumber = (numero || '').toString().replace(/%20/g, '').replace(/\s/g, '');
    if (cleanNumber.length < 3) return cleanNumber;
    const lastThreeDigits = cleanNumber.slice(-3);
    return `*** *** ${lastThreeDigits}`;
  }

  paraFloatxd(value: any): any {
    if (value) return parseFloat(value);
    return 0;
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

  // ===== Corto default tipo yape (fallback) =====
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
    const primerApellido = partes[partes.length - 2] || '';

    const nombreCapitalizado = primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1);
    const apellidoCorto = primerApellido.substring(0, 3);
    const apellidoCapitalizado = apellidoCorto.charAt(0).toUpperCase() + apellidoCorto.slice(1);

    return `${nombreCapitalizado} ${apellidoCapitalizado}*`;
  }

  /** "ROCIO JACKELINE BAYLON JIMENEZ" -> "ROCIO J. BAYLON J." */
  private formatoIniciales(full: string): string {
    const parts = (full || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].toUpperCase();
    if (parts.length === 2) return `${parts[0].toUpperCase()} ${parts[1][0].toUpperCase()}.`;

    const firstName = parts[0].toUpperCase();
    const middle = parts.slice(1, -2).map(p => (p[0] ? p[0].toUpperCase() + '.' : '')).join(' ').trim();
    const last1 = (parts[parts.length - 2] || '').toUpperCase();
    const last2Init = (parts[parts.length - 1] || '')[0]?.toUpperCase();

    return `${firstName} ${middle ? middle + ' ' : ''}${last1} ${last2Init ? last2Init + '.' : ''}`.trim();
  }
}
