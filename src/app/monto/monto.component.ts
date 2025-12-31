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

  // ===== UI =====
  mostrarPreload: boolean = false;
  consultando: boolean = false;
  botonesHabilitados: boolean = false;

  // ===== Mensaje =====
  message_type: string = "";

  // ===== Data (tu HTML usa "nombre") =====
  nombre: any = null;
  monto: any = null;
  numero: any = null;
  telefono: any = null;
  destino: any = null;

  numeroaleatoriomostrar: string = "";
  codigoSeguridad: string = '';
  fechaActual: string = '';
  fechaduplicada: string = '';
  place_holder: string = '';

  // ===== Flags =====
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;
  determinarNoD: string = '';

  // ===== 3 MODOS NOMBRE =====
  // 0=corto (Rocio Bay*) 1=iniciales (Rocio J. Baylon J.) 2=completo
  nameMode: 0 | 1 | 2 = 0;

  nombreFull: string = '';        // full real (NUNCA se pierde)
  nombreCorto: string = '';       // "Rocio Bay*"
  nombreIniciales: string = '';   // "Rocio J. Baylon J."

  // empresa => siempre full
  isEmpresa: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApisService,
    private apiLogs: ApiLogService
  ) {}

  // ================== INPUT MENSAJE ==================
  typeMessage(e: Event): void {
    const v = (e.target as HTMLInputElement)?.value;
    if (v !== undefined) this.message_type = v;
  }

  // ================== TOGGLE OCULTO (3 estados) ==================
  toggleNombre(): void {
    // Empresas: no permitir “resumir”
    if (this.isEmpresa) {
      this.nameMode = 2;
      this.nombre = this.nombreFull;
      return;
    }

    this.nameMode = ((this.nameMode + 1) % 3) as 0 | 1 | 2;
    this.aplicarModoNombre();
  }

  private aplicarModoNombre(): void {
    const fullSafe = (this.nombreFull || this.nombre || '').toString().trim();
    if (!fullSafe) return;

    if (this.nameMode === 0) this.nombre = this.nombreCorto || fullSafe;
    if (this.nameMode === 1) this.nombre = this.nombreIniciales || fullSafe;
    if (this.nameMode === 2) this.nombre = fullSafe;
  }

  /**
   * Llamar cada vez que recibes un nombre REAL (API o params).
   * Aquí es donde garantizamos que FULL se guarda y los 3 modos se calculan bien.
   */
  private setNombreFull(fullRaw: string): void {
    const full = this.toTitleCase((fullRaw || '').toString().replace(/\s+/g, ' ').trim());
    if (!full) return;

    this.nombreFull = full;

    // detectar empresa / razón social
    this.isEmpresa = this.esNombreEmpresa(full);

    // generar modos
    this.nombreIniciales = this.formatoIniciales(full);

    if (this.isEmpresa) {
      // empresa => full siempre (y los otros modos apuntan a full para que no “se pierda”)
      this.nombreCorto = full;
      this.nameMode = 2;
      this.nombre = full;
      return;
    }

    this.nombreCorto = this.formatoCortoYape(full);

    // default: si destino es yape => corto, si no => full
    this.nameMode = (this.destino === 'Yape') ? 0 : 2;
    this.aplicarModoNombre();
  }

  // ================== INIT ==================
  ngOnInit() {
    // (Lo dejo como lo tenías, aunque ojo: this.monto aún es null al iniciar)
    const dinero = Number(localStorage.getItem("monto"));
    localStorage.setItem("monto", String(dinero - Number(this.monto)) + '.00');

    // cod seguridad
    this.codigoSeguridad = (Math.floor(Math.random() * 900) + 100).toString();

    this.route.queryParams.subscribe(params => {
      const pDeNumero = params['deNumero'] === true || params['deNumero'] === 'true';
      const pDeQr     = params['deQr'] === true || params['deQr'] === 'true';
      const pDeNuevo  = params['deNuevo'] === true || params['deNuevo'] === 'true';

      this.deNumero = pDeNumero;
      this.deQr = pDeQr;
      this.deNuevo = pDeNuevo;

      // ✅ evitar que entre a 2 ramas y “pise” el nombre
      if (pDeNumero) {
        this.numero = params['numero'];
        this.telefono = this.formatNumber(params['numero']);
        this.destino = 'Yape';
        this.determinarNoD = this.telefono;

        this.numeroaleatoriomostrar = '01' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        // IMPORTANTE: aquí asumimos que params['nombre'] podría venir full
        this.setNombreFull(params['nombre'] || '');

      } else if (pDeQr) {
        this.numero = params['numero'];
        this.destino = params['destino'];
        this.determinarNoD = this.destino;

        if (this.destino === 'Yape') {
          this.numeroaleatoriomostrar = '01' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        } else {
          this.numeroaleatoriomostrar = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        }

        this.setNombreFull(params['nombre'] || '');

      } else if (pDeNuevo) {
        this.numero = params['numero'];
        this.telefono = this.formatNumber(params['numero']);
        this.destino = params['destino'];
        this.determinarNoD = this.telefono;

        if (this.destino === 'Yape') {
          this.numeroaleatoriomostrar = '01' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        } else {
          this.numeroaleatoriomostrar = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        }

        this.setNombreFull(params['nombre'] || '');
      }
    });

    this.formatearFecha(new Date());
  }

  // ================== CONSULTA YAPE ==================
  getYapeNombre() {
    this.place_holder = "";
    this.consultando = true;

    const userDataString = localStorage.getItem("user-data-xmwiizz");
    if (!userDataString) {
      this.consultando = false;
      this.place_holder = "[ INGRESE EL NOMBRE ]";
      return;
    }

    const data = JSON.parse(userDataString);
    const username = data.usuario.username;
    const password = data.usuario.password;
    const seller_id = data.usuario.seller_id;

    this.api.consultarInformacionYape(this.numero, username, password, seller_id).subscribe(
      (response: any) => {
        this.consultando = false;

        // ✅ acá llega el FULL real
        this.destino = 'Yape';
        this.setNombreFull(response?.receiverName || '');
      },
      (error: any) => {
        this.consultando = false;

        if (error.status == 429) {
          const tiempo_ahora = error.error.tiempo_ahora;
          const tiempo_ultima_consulta = error.error.tiempo_ultima_consulta;
          const tiempoEspera = Math.ceil((tiempo_ahora - tiempo_ultima_consulta) / 60);
          this.place_holder = `[ ESPERE ${tiempoEspera} MINUTOS ]`;
        } else {
          this.place_holder = "[ INGRESE EL NOMBRE ]";
        }
      }
    );
  }

  consult() {
    this.consultando = false;
  }

  actualizarBotones() {
    this.botonesHabilitados = this.monto > 0;
  }

  // ================== FORMATEOS NOMBRE ==================

  /** FULL -> Title Case */
  private toTitleCase(str: string): string {
    return (str || '')
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * MODO CORTO estilo yape:
   * - 2 palabras: Ronaldo Qui -> Ronaldo Qui*
   * - 3 palabras: Jose Bayron Moises -> Jose Bay*
   * - 4 palabras: Martin Juan Vasquez Ruiz -> Martin Vas*
   *
   * Regla: usar primer nombre + "primer apellido real"
   * Si hay 2 palabras, el 2do es apellido.
   * Si hay 3+ palabras, el apellido suele ser el penúltimo.
   */
  private formatoCortoYape(full: string): string {
    const words = (full || '')
      .replace(/\./g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);

    if (words.length === 0) return '';
    if (words.length === 1) return words[0];

    const firstName = words[0];

    let lastName = '';
    if (words.length === 2) {
      lastName = words[1];
    } else {
      lastName = words[words.length - 2]; // penúltimo
    }

    if (!lastName) return firstName;
    return `${firstName} ${lastName.substring(0, 3)}*`;
  }

  /** FULL -> "Rocio J. Baylon J." (Title Case) */
  private formatoIniciales(full: string): string {
    const parts = (full || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return this.toTitleCase(parts[0]);

    // 2 palabras: "Rocio Baylon" -> "Rocio B."
    if (parts.length === 2) {
      const first = this.toTitleCase(parts[0]);
      return `${first} ${parts[1][0].toUpperCase()}.`;
    }

    // 3+:
    const firstName = this.toTitleCase(parts[0]);

    const middle = parts
      .slice(1, -2)
      .map(p => (p[0] ? p[0].toUpperCase() + '.' : ''))
      .filter(Boolean)
      .join(' ');

    const last1 = this.toTitleCase(parts[parts.length - 2]);
    const last2Init = parts[parts.length - 1]?.[0]?.toUpperCase();

    const middleWithSpace = middle ? middle + ' ' : '';
    const last2 = last2Init ? ` ${last2Init}.` : '';

    return `${firstName} ${middleWithSpace}${last1}${last2}`.trim();
  }

  /**
   * Detecta razón social / empresa (heurística).
   * Si es empresa => forzar FULL (nada de * ni iniciales).
   */
  private esNombreEmpresa(full: string): boolean {
    const s = (full || '').toUpperCase();

    // muchos puntos suele ser abreviación legal "S.A.C." "E.I.R.L." etc.
    const dots = (s.match(/\./g) || []).length;

    const legal =
      /\bS\.?\s*A\.?\s*C\.?\b|\bS\.?\s*A\.?\b|\bS\.?\s*R\.?\s*L\.?\b|\bE\.?\s*I\.?\s*R\.?\s*L\.?\b|\bSAS\b|\bS\.?\s*DE\s*R\.?\s*L\.?\b/.test(s);

    const keywords =
      /\bEMPRESA\b|\bTRANSPORTES\b|\bINVERSIONES\b|\bSERVICIOS\b|\bCOMERCIAL\b|\bINDUSTRIAL\b|\bCORPORACION\b|\bCORP\b|\bEIRL\b|\bSAC\b|\bSRL\b/.test(s);

    return legal || keywords || dots >= 2;
  }

  // ================== NUMERO / FECHA ==================
  formatNumber(numero: string): string {
    const cleanNumber = (numero || '').toString().replace(/%20/g, '').replace(/\s/g, '');
    if (cleanNumber.length < 3) return cleanNumber;
    const lastThreeDigits = cleanNumber.slice(-3);
    return `*** *** ${lastThreeDigits}`;
  }

  formatearFecha(fechaActual: Date): void {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    const dia = this.agregarCeroDelante(fechaActual.getDate());
    const mes = meses[fechaActual.getMonth()];
    const año = fechaActual.getFullYear();
    let hora = fechaActual.getHours();
    const minutos = this.agregarCeroDelante(fechaActual.getMinutes());
    const periodo = hora < 12 ? ' am' : ' pm';

    hora = hora % 12 || 12;
    this.fechaduplicada = `${dia} ${mes}. ${año} - ${hora}:${minutos}${periodo}`;
  }

  private agregarCeroDelante(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  // ================== NAV ==================
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
    const deNumero = this.deNumero;
    const deNuevo = this.deNuevo;
    const deQr = this.deQr;
    const numero = this.numero;
    const mensaje = this.message_type;

    // lo que se ve actualmente (respetar modo)
    const nombreParaMostrar = (this.nombre || '').toString();

    this.router.navigate(['/bancos-pago'], {
      queryParams: {
        numero,
        monto,
        mensaje,
        deNumero,
        deNuevo,
        deQr,

        // para que bancos-pago también respete tu modo actual
        nombre: nombreParaMostrar,
        nombreFull: this.nombreFull,
        nombreCorto: this.nombreCorto,
        nombreIniciales: this.nombreIniciales,
        nameMode: this.nameMode,
        isEmpresa: this.isEmpresa
      }
    });
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

    // ✅ lo que viaja es EXACTAMENTE lo que se ve en el input
    const nombreParaMostrar = (this.nombre || '').toString();

    this.mostrarPreload = true;
    setTimeout(() => {
      this.mostrarPreload = false;
      this.router.navigate(['/yapeo'], {
        queryParams: {
          nombre: nombreParaMostrar,

          // extras para coherencia
          nombreFull: this.nombreFull,
          nombreCorto: this.nombreCorto,
          nombreIniciales: this.nombreIniciales,
          nameMode: this.nameMode,
          isEmpresa: this.isEmpresa,

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
}
