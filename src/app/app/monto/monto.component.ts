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

  // ===== Data =====
  nombre: any = null; // tu HTML usa [(ngModel)]="nombre"
  monto: any = null;
  numero: any = null;
  telefono: any = null;
  destino: any = null;

  numeroaleatoriomostrar: string = "";
  codigoSeguridad: string = '';
  fechaduplicada: string = '';
  place_holder: string = '';
  determinarNoD: string = '';

  // ===== Flags =====
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;

  // ===== 3 MODOS NOMBRE =====
  // 0=corto (Rosa Veg*) 1=iniciales (Rosa J. Vega S.) 2=completo
  nameMode: 0 | 1 | 2 = 0;

  // “La verdad” que vamos construyendo
  nombreFull: string = '';
  nombreCorto: string = '';
  nombreIniciales: string = '';

  // Para saber si el “full” actual está abreviado
  fullPareceAbreviado: boolean = false;

  // Throttle anti-429
  private lastFullFetchAtMs = 0;
  private readonly FULL_FETCH_COOLDOWN_MS = 25_000; // 25s

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

  // ================== BOTÓN OCULTO (3 estados) ==================
  toggleNombre(): void {
    // rota: corto -> iniciales -> full -> corto...
    this.nameMode = ((this.nameMode + 1) % 3) as 0 | 1 | 2;

    // si el usuario pidió FULL y el full está abreviado, intentamos completar
    if (this.nameMode === 2) {
      this.ensureFullName('toggle_full');
    } else {
      this.aplicarModoNombre('toggle');
    }
  }

  private aplicarModoNombre(reason: string): void {
    const fullSafe = (this.nombreFull || this.nombre || '').toString().trim();
    if (!fullSafe) return;

    if (this.nameMode === 0) this.nombre = this.nombreCorto || fullSafe;
    if (this.nameMode === 1) this.nombre = this.nombreIniciales || fullSafe;
    if (this.nameMode === 2) this.nombre = this.nombreFull || fullSafe;

    console.log(`[NAME] aplicar (${reason}) mode=${this.nameMode}`, {
      nombre: this.nombre,
      nombreFull: this.nombreFull,
      nombreCorto: this.nombreCorto,
      nombreIniciales: this.nombreIniciales,
      fullPareceAbreviado: this.fullPareceAbreviado
    });
  }

  /**
   * Setea nombre desde params o API (RAW).
   * REGLA: SIEMPRE arrancar mostrando el formato corto (modo 0) como tú pediste.
   */
  private setNombreDesdeFuente(raw: string, source: 'params' | 'api'): void {
    const rawTrim = (raw || '').toString().replace(/\s+/g, ' ').trim();
    if (!rawTrim) return;

    // FULL “bonito” (pero puede venir abreviado igual)
    const full = this.toTitleCaseConPuntos(rawTrim);
    this.nombreFull = full;

    // Detectar si “parece abreviado” (ej: "S.", "J.", etc.)
    this.fullPareceAbreviado = this.pareceAbreviado(full);

    // Base sin puntos para construir formatos de persona
    const baseSinPuntos = this.toTitleCase(rawTrim.replace(/\./g, ''));

    // corto: primer nombre + 3 letras del “primer apellido” según tu patrón
    this.nombreCorto = this.formatoCortoYape(baseSinPuntos);

    // iniciales: siempre Title Case (no todo mayúscula)
    // si ya venía con puntos, lo respeta pero en Title Case
    this.nombreIniciales = this.formatoIniciales(baseSinPuntos);

    // SIEMPRE default en corto (modo 0)
    this.nameMode = 0;
    this.aplicarModoNombre(`setNombreDesdeFuente_${source}`);

    console.log(`[NAME] setNombreDesdeFuente`, {
      source,
      rawTrim,
      nombreFull: this.nombreFull,
      nombreCorto: this.nombreCorto,
      nombreIniciales: this.nombreIniciales,
      fullPareceAbreviado: this.fullPareceAbreviado,
      numero: this.numero
    });
  }

  // ================== INIT ==================
  ngOnInit() {
    // (lo dejo como lo tenías)
    const dinero = Number(localStorage.getItem("monto"));
    localStorage.setItem("monto", String(dinero - Number(this.monto)) + '.00');

    this.codigoSeguridad = (Math.floor(Math.random() * 900) + 100).toString();

    this.route.queryParams.subscribe(params => {
      const pDeNumero = params['deNumero'] === true || params['deNumero'] === 'true';
      const pDeQr     = params['deQr'] === true || params['deQr'] === 'true';
      const pDeNuevo  = params['deNuevo'] === true || params['deNuevo'] === 'true';

      this.deNumero = pDeNumero;
      this.deQr = pDeQr;
      this.deNuevo = pDeNuevo;

      if (pDeNumero) {
        this.numero = params['numero'];
        this.telefono = this.formatNumber(params['numero']);
        this.destino = 'Yape';
        this.determinarNoD = this.telefono;

        this.numeroaleatoriomostrar =
          '01' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        this.setNombreDesdeFuente(params['nombre'] || '', 'params');

      } else if (pDeQr) {
        this.numero = params['numero'];
        this.destino = params['destino'];
        this.determinarNoD = this.destino;

        if (this.destino === 'Yape') {
          this.numeroaleatoriomostrar =
            '01' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        } else {
          this.numeroaleatoriomostrar =
            Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        }

        this.setNombreDesdeFuente(params['nombre'] || '', 'params');

      } else if (pDeNuevo) {
        this.numero = params['numero'];
        this.telefono = this.formatNumber(params['numero']);
        this.destino = params['destino'];
        this.determinarNoD = this.telefono;

        if (this.destino === 'Yape') {
          this.numeroaleatoriomostrar =
            '01' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        } else {
          this.numeroaleatoriomostrar =
            Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        }

        this.setNombreDesdeFuente(params['nombre'] || '', 'params');
      }

      // IMPORTANTE: si desde params vino abreviado, intenta precargar cache si existe
      this.applyCacheIfExists('init');
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
        this.destino = 'Yape';
        const fullApi = (response?.receiverName || '').toString();

        // cachear el full real por número
        this.saveFullCache(fullApi);

        // set desde API
        this.setNombreDesdeFuente(fullApi, 'api');
      },
      (error: any) => {
        this.consultando = false;

        if (error.status == 429) {
          const tiempo_ahora = error.error?.tiempo_ahora;
          const tiempo_ultima_consulta = error.error?.tiempo_ultima_consulta;
          if (tiempo_ahora && tiempo_ultima_consulta) {
            const tiempoEspera = Math.ceil((tiempo_ahora - tiempo_ultima_consulta) / 60);
            this.place_holder = `[ ESPERE ${tiempoEspera} MINUTOS ]`;
          } else {
            this.place_holder = `[ ESPERE UN MOMENTO ]`;
          }
        } else {
          this.place_holder = "[ INGRESE EL NOMBRE ]";
        }
      }
    );
  }

  // ✅ lo usa tu HTML (click cuando consultando)
  consult() {
    this.consultando = false;
  }

  // ✅ lo usa tu HTML (input monto)
  actualizarBotones() {
    this.botonesHabilitados = Number(this.monto) > 0;
  }

  // ================== FULL NAME FORZADO (cache + throttle + API) ==================
  private ensureFullName(reason: string): void {
    // Si ya tenemos un full “que no parece abreviado”, solo aplicar
    if (this.nombreFull && !this.fullPareceAbreviado) {
      this.aplicarModoNombre(`ensureFull_ok_${reason}`);
      return;
    }

    // 1) cache primero
    const cached = this.getFullCache();
    if (cached) {
      console.log(`[NAME] ensureFull: usando CACHE. reason=${reason}`, cached);
      this.setNombreDesdeFuente(cached, 'api'); // lo tratamos como “api” porque es full real
      this.nameMode = 2;
      this.aplicarModoNombre(`ensureFull_cache_${reason}`);
      return;
    }

    // 2) si no hay numero, no podemos pedir API
    if (!this.numero) {
      console.log(`[NAME] ensureFull: SIN numero, no se puede pedir API. reason=${reason}`);
      this.aplicarModoNombre(`ensureFull_noNumero_${reason}`);
      return;
    }

    // 3) throttle anti 429
    const now = Date.now();
    if (now - this.lastFullFetchAtMs < this.FULL_FETCH_COOLDOWN_MS) {
      console.log(`[NAME] ensureFull: throttled (anti429). reason=${reason}`);
      this.aplicarModoNombre(`ensureFull_throttled_${reason}`);
      return;
    }
    this.lastFullFetchAtMs = now;

    // 4) pedir API una vez
    console.log(`[NAME] ensureFull: llamando API. reason=${reason}`, { numero: this.numero });

    const userDataString = localStorage.getItem("user-data-xmwiizz");
    if (!userDataString) {
      console.log(`[NAME] ensureFull: no hay user-data-xmwiizz`);
      this.aplicarModoNombre(`ensureFull_noUser_${reason}`);
      return;
    }

    const data = JSON.parse(userDataString);
    const username = data.usuario.username;
    const password = data.usuario.password;
    const seller_id = data.usuario.seller_id;

    this.api.consultarInformacionYape(this.numero, username, password, seller_id).subscribe({
      next: (response: any) => {
        const fullApi = (response?.receiverName || '').toString();
        console.log(`[NAME] ensureFull: API OK`, fullApi);

        this.saveFullCache(fullApi);
        this.setNombreDesdeFuente(fullApi, 'api');

        // forzar FULL
        this.nameMode = 2;
        this.aplicarModoNombre(`ensureFull_apiOK_${reason}`);
      },
      error: (err: any) => {
        console.warn(`[NAME] ensureFull: API FAIL`, { status: err?.status, err });

        // si falla (429), igual mostramos lo mejor que tengamos
        this.aplicarModoNombre(`ensureFull_apiFAIL_${reason}`);
      }
    });
  }

  private applyCacheIfExists(reason: string) {
    const cached = this.getFullCache();
    if (!cached) return;

    // solo lo aplicamos si nuestro full actual parece abreviado o está vacío
    if (!this.nombreFull || this.fullPareceAbreviado) {
      console.log(`[NAME] applyCacheIfExists (${reason}) usando cache`, cached);
      this.setNombreDesdeFuente(cached, 'api');
      // volver a corto por defecto (regla tuya)
      this.nameMode = 0;
      this.aplicarModoNombre(`applyCache_${reason}`);
    }
  }

  private cacheKey(): string | null {
    const n = (this.numero || '').toString().trim();
    if (!n) return null;
    return `FULLNAME_CACHE_${n}`;
  }

  private saveFullCache(full: string) {
    const key = this.cacheKey();
    const v = (full || '').toString().replace(/\s+/g, ' ').trim();
    if (!key || !v) return;
    localStorage.setItem(key, v);
  }

  private getFullCache(): string | null {
    const key = this.cacheKey();
    if (!key) return null;
    const v = localStorage.getItem(key);
    return v ? v.toString() : null;
  }

  // ================== FORMATEOS ==================
  private toTitleCase(str: string): string {
    return (str || '')
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private toTitleCaseConPuntos(str: string): string {
    return (str || '')
      .split(' ')
      .filter(Boolean)
      .map(token => {
        // inicial "J." => "J."
        if (/^[A-Za-zÁÉÍÓÚÑ]\.$/i.test(token)) return token[0].toUpperCase() + '.';
        // tokens tipo "S.A.C." => mayúsculas
        if (/[A-Za-z]\.[A-Za-z]/.test(token)) return token.toUpperCase();
        // normal
        const clean = token.toLowerCase();
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      })
      .join(' ');
  }

  // Detecta si el “full” está abreviado (muchas iniciales o termina en "S.")
  private pareceAbreviado(full: string): boolean {
    const s = (full || '').trim();
    if (!s) return false;

    // contiene tokens de 1 letra con punto: "J." "S."
    const hasInitials = /\b[A-Za-zÁÉÍÓÚÑ]\.\b/.test(s);

    // típico caso empresa recortada: "... S."
    const endsLikeSdot = /\bS\.\s*$/.test(s);

    return hasInitials || endsLikeSdot;
  }

  /**
   * CORTO: patrón que pediste
   * - 1 palabra: "Ronaldo"
   * - 2 palabras: usa 2da "Ronaldo Qui*" (3 letras)
   * - 3 palabras: usa 2da "Jose Bay*"
   * - 4+ palabras: usa penúltima "Martin Vas*"
   */
  private formatoCortoYape(fullSinPuntos: string): string {
    const words = (fullSinPuntos || '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);

    if (words.length === 0) return '';
    if (words.length === 1) return words[0];

    const firstName = words[0];
    let apellido = '';

    if (words.length === 2) apellido = words[1];
    else if (words.length === 3) apellido = words[1];         // ✅ tu patrón
    else apellido = words[words.length - 2];                  // ✅ 4+ => penúltimo

    if (!apellido) return firstName;

    return `${firstName} ${apellido.substring(0, 3)}*`;
  }

  // iniciales: "Rosa J. Vega S."
  private formatoIniciales(fullSinPuntos: string): string {
    const parts = (fullSinPuntos || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return this.toTitleCase(parts[0]);

    // 2 palabras: "Rosa Vega" => "Rosa V."
    if (parts.length === 2) {
      const first = this.toTitleCase(parts[0]);
      return `${first} ${parts[1][0].toUpperCase()}.`;
    }

    // 3+:
    const firstName = this.toTitleCase(parts[0]);

    // middle: 2do nombre(s) (si hay)
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

  // mask teléfono
  formatNumber(numero: string): string {
    const cleanNumber = (numero || '').toString().replace(/%20/g, '').replace(/\s/g, '');
    if (cleanNumber.length < 3) return cleanNumber;
    const lastThreeDigits = cleanNumber.slice(-3);
    return `*** *** ${lastThreeDigits}`;
  }

  // ================== FECHA / UTIL ==================
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

  formatearNumero(): string {
    const ultimosTresDigitos: string = (this.telefono || '').toString().slice(-3);
    return `*** *** ${ultimosTresDigitos}`;
  }

  nombreIniciaConIzi(): boolean {
    return (this.nombre || '').toString().startsWith('Izi*');
  }

  // ================== NAV ==================
  homeComponente() { this.router.navigate(['/home']); }
  yapearComponente() { this.router.navigate(['/yapear']); }
  yapeoComponente() { this.router.navigate(['/yapeo']); }

  bancosComponent(monto: number) {
    const nombreParaMostrar = (this.nombre || '').toString();
    this.router.navigate(['/bancos-pago'], {
      queryParams: {
        numero: this.numero,
        monto,
        mensaje: this.message_type,
        deNumero: this.deNumero,
        deNuevo: this.deNuevo,
        deQr: this.deQr,
        nombre: nombreParaMostrar,
        nameMode: this.nameMode
      }
    });
  }

  yapeoComponent(nombre: string, monto: number) {
    const nombreParaMostrar = (this.nombre || '').toString();

    this.mostrarPreload = true;
    setTimeout(() => {
      this.mostrarPreload = false;
      this.router.navigate(['/yapeo'], {
        queryParams: {
          nombre: nombreParaMostrar,
          nameMode: this.nameMode,
          cantidad: monto,
          numero: this.numero,
          telefono: this.telefono,
          destino: this.destino,
          mensaje: this.message_type,
          numeroaleatoriomostrar: this.numeroaleatoriomostrar,
          codigoSeguridad: this.codigoSeguridad,
          deNumero: this.deNumero,
          deNuevo: this.deNuevo,
          deQr: this.deQr
        }
      });
    }, 2000);
  }
}
