import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreloadComponent } from '../preload/preload.component';
import { ApisService } from '../apis.service';
import { ApiLogService } from '../api-log.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bancos-pago',
  standalone: true,
  providers: [],
  imports: [CommonModule, PreloadComponent, FormsModule],
  templateUrl: './bancos-pago.component.html',
  styleUrl: './bancos-pago.component.scss'
})
export class BancosPagoComponent implements OnInit {

  mostrarAlerta: boolean = false;
  monto: string = "";
  numero: any = null;

  // compat (input usa [(ngModel)]="nombre")
  nombre: string = "";

  // ===== ✅ 3 MODOS NOMBRE =====
  // 0=corto "Rocio Bay*" 1=iniciales "ROCIO J. BAYLON J." 2=completo
  nameMode: 0 | 1 | 2 = 0;
  nombreFull: string = "";
  nombreCorto: string = "";
  nombreIniciales: string = "";
  nombreMostrar: string = "";

  datos: any[] = [];
  aparece: boolean = false;
  destino: string = "";
  forxx: string = "";
  codigo: string = "";
  codigoSeguridad: string = '';

  cargando: boolean = true;
  brands: string[] = [];
  existeYape: boolean = false;
  otrasEntidades: boolean = false;
  mostrarPreload: boolean = false;
  numeroaleatoriomostrar: string = "";
  mensaje: any = '';

  // flags origen
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApisService,
    private logApi: ApiLogService
  ) {
    this.route.queryParams.subscribe(params => {
      this.numero = params['numero'];
      this.mensaje = params['mensaje'];
      this.forxx = this.numero?.slice(-3) || '';
      this.monto = params['monto'];

      this.deNumero = params['deNumero'] === true || params['deNumero'] === 'true';
      this.deQr = params['deQr'] === true || params['deQr'] === 'true';
      this.deNuevo = params['deNuevo'] === true || params['deNuevo'] === 'true';

      // ✅ Recibir los 3 nombres + modo desde Monto
      this.nameMode = Number(params['nameMode'] ?? 0) as 0 | 1 | 2;
      this.nombreFull = (params['nombreFull'] || '').toString();
      this.nombreCorto = (params['nombreCorto'] || '').toString();
      this.nombreIniciales = (params['nombreIniciales'] || '').toString();

      // por si solo llega "nombre" (fallback)
      const nombreCompat = (params['nombre'] || '').toString();
      if (!this.nombreFull && nombreCompat) this.nombreFull = nombreCompat;

      this.aplicarModoNombre();
    });

    const datos_usuario = localStorage.getItem("user-data-xmwiizz");
    if (datos_usuario) {
      const user_data = JSON.parse(datos_usuario);

      const username = user_data.usuario.username;
      const password = user_data.usuario.password;
      const seller_id = user_data.usuario.seller_id;

      this.api.consultarBancosNew(seller_id, this.numero, username, password).subscribe({
        next: (res) => {
          this.cargando = false;
          this.brands = res.brands_disponibles || [];
          this.existeYape = this.brands.includes('YAPE');
          this.otrasEntidades = this.brands.some((b: string) => b !== 'YAPE');
          if (this.brands.length === 0) {
            this.cargando = false;
          }
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }

  ngOnInit() {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
  }

  // ================== NOMBRE 3 MODOS ==================
  private aplicarModoNombre(): void {
  const full = (this.nombreFull || '').trim();

  // fallback: si por algo no hay full, usa lo que haya en nombre
  const fullSafe = full || (this.nombre || '').toString().trim();

  this.nombreMostrar =
    this.nameMode === 0 ? (this.nombreCorto || fullSafe) :
    this.nameMode === 1 ? (this.nombreIniciales || fullSafe) :
    fullSafe;

  this.nombre = this.nombreMostrar;
}


  private setNombreFull(fullRaw: string): void {
    const full = this.capitalizeWords((fullRaw || '').toString().replace(/\s+/g, ' ').trim());
    this.nombreFull = full;

    // corto tipo Yape (Rocio Bay*)
    this.nombreCorto = this.formatReceiverNameCorto(full);

    // iniciales tipo (ROCIO J. BAYLON J.)
    this.nombreIniciales = this.formatoIniciales(full);

    // mantiene el modo actual (NO lo resetea)
    this.aplicarModoNombre();
  }

  // === CORTO: "Rocio Bay*" ===
  private formatReceiverNameCorto(full: string): string {
    const words = (full || '').trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return this.capitalizeWords(full);

    const first = this.capitalizeFirstLetter(words[0]);
    const last = this.capitalizeFirstLetter(words[words.length - 2]); // primer apellido (penúltimo)
    return `${first} ${last.substring(0, 3)}*`;
  }

  // === INICIALES: "ROCIO J. BAYLON J." ===
 private formatoIniciales(full: string): string {
  const parts = (full || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return this.capitalizeFirstLetter(parts[0]);

  // 2 palabras: "Rocio Baylon" -> "Rocio B."
  if (parts.length === 2) {
    return `${this.capitalizeFirstLetter(parts[0])} ${parts[1][0].toUpperCase()}.`;
  }

  // 3+ palabras:
  // [0]=nombre, [1..-3]=segundos nombres, [-2]=apellido paterno, [-1]=apellido materno
  const firstName = this.capitalizeFirstLetter(parts[0]);

  const middle = parts
    .slice(1, -2)
    .map(p => (p[0] ? p[0].toUpperCase() + '.' : ''))
    .filter(Boolean)
    .join(' ');

  const last1 = this.capitalizeFirstLetter(parts[parts.length - 2]);
  const last2Init = parts[parts.length - 1]?.[0]?.toUpperCase();

  const middleWithSpace = middle ? middle + ' ' : '';
  const last2 = last2Init ? ` ${last2Init}.` : '';

  return `${firstName} ${middleWithSpace}${last1}${last2}`.trim();
}

  // ================== UI ==================
  MostrarConsola(brand: string) {
    console.log('Marca seleccionada:', brand);
  }

  buscar(brand: string) {
    this.mostrarPreload = true;
    const userDataString = localStorage.getItem("user-data-xmwiizz");

    if (!userDataString) {
      this.mostrarPreload = false;
      return;
    }

    const data = JSON.parse(userDataString);
    const username = data.usuario.username;
    const password = data.usuario.password;
    const seller_id = data.usuario.seller_id;

    this.api.consultarInformacionBancos(this.numero, brand, username, password, seller_id).subscribe({
      next: (res: any) => {
        this.mostrarAlerta = true;

        // ✅ recalcular 3 nombres (manteniendo el modo)
        this.setNombreFull(res?.receiverName || '');

        this.destino = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
        this.mostrarPreload = false;
      },
      error: () => {
        this.mostrarPreload = false;
      }
    });
  }

  openTab(typeX: string) {
    if (typeX.includes("bim")) {
      this.destino = "Bim";
      this.mostrarAlerta = true;
    } else {
      this.destino = "Agora / Oh!";
      this.mostrarAlerta = true;
    }
  }

  confirmar() {
    const numeroaleatoriomostrar = this.numeroaleatoriomostrar;
    const mensaje = this.mensaje;

    // ✅ Si el usuario editó manualmente el input, lo consideramos como "lo que quiere mostrar"
    // y lo usamos como nombreMostrar (pero no tocamos nameMode para no romper el estado)
    if (this.nombre && this.nombre !== this.nombreMostrar) {
      this.nombreMostrar = this.nombre;
    }

    const queryParams = {
      // ✅ lo que se verá en yapeo
      nombre: this.nombreMostrar,

      // ✅ los 3 modos + modo actual
      nombreFull: this.nombreFull,
      nombreCorto: this.nombreCorto,
      nombreIniciales: this.nombreIniciales,
      nameMode: this.nameMode,

      // resto
      numero: this.numero,
      destino: this.destino,
      mensaje: mensaje,
      numeroaleatoriomostrar,
      cantidad: this.monto,
      deNumero: this.deNumero,
      deNuevo: this.deNuevo,
      deQr: this.deQr,
    };

    this.mostrarPreload = true;
    setTimeout(() => {
      this.mostrarPreload = false;
      this.router.navigate(['/yapeo'], { queryParams });
    }, 2000);
  }

  cancelar() {
    this.mostrarAlerta = false;
  }

  // ================== Helpers ==================
  private capitalizeWords(str: string): string {
    const words = (str || '').toString().split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    return capitalizedWords.join(" ");
  }

  private capitalizeFirstLetter(word: string): string {
    return (word || '').toString().charAt(0).toUpperCase() + (word || '').toString().slice(1).toLowerCase();
  }

  homeComponente() {
    this.router.navigate(['/home']);
  }

  yapearComponente() {
    this.router.navigate(['/yapear']);
  }
}
