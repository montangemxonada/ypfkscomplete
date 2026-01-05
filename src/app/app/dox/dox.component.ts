import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

// ✅ TU PROXY EN RENDER (NO el upstream)
const BASE_URL = 'https://apidxyape.onrender.com';
const PATH_DNI = '/api/dni';
const API_URL_DNI = `${BASE_URL}${PATH_DNI}`;

// IMPORTANTE:
// Para que el hash funcione, el cliente debe firmar con SIGNING_SECRET.
// Si lo pones aquí, se puede extraer del frontend.
// Úsalo así por ahora para que funcione; luego te explico cómo pasarlo a algo más seguro.
const SIGNING_SECRET = (localStorage.getItem('SIGNING_SECRET') || 'rocketguardianes').trim(); // ponlo en localStorage o reemplaza temporalmente

function onlyDigits(v: string) { return (v ?? '').replace(/[^0-9]/g, ''); }

type ReniecInfo = {
  dni?: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  sexo?: string;
  genero?: string;

  fecha_nacimiento?: string;
  fecha_emision?: string;
  fecha_caducidad?: string;
  fecha_inscripcion?: string;

  distrito_n?: string;
  provincia_n?: string;
  departamento_n?: string;

  estatura?: string;
  estado_civil?: string;
  grado_instruccion?: string;
  restriccion?: string;

  padre?: string;
  madre?: string;

  direccion_n?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;

  ubigeo_reniec?: string;
  ubigeo_inei?: string;
  ubigeo_sunat?: string;
  codigo_postal?: string;

  face_b64?: string;
};

@Component({
  selector: 'app-dox',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dox.component.html',
  styleUrls: ['./dox.component.scss']
})
export class DoxComponent {
  dni = '';
  loading = false;
  showAd = false;

  errorMsg = '';
  info: ReniecInfo | null = null;

  // Anti-abuso en cliente (además del servidor): no consultar más de 1 vez / 10s
  private nextAllowedAt = 0;

  // anuncio placeholder (luego lo rotas)
  adTitle = 'ANUNCIO';
  adText  = 'Aquí irá tu anuncio rotativo (3s).';

  constructor(private http: HttpClient) {}

  back() {
    history.back();
  }

  onDniInput(v: string) {
    this.dni = onlyDigits(v).slice(0, 8);
  }

  // ---------------------------
  // Firma HMAC (WebCrypto) - SIN LIBRERÍAS
  // x-ts, x-nonce, x-sig = HMAC_SHA256(secret, `${ts}.${nonce}.${METHOD}.${PATH}.${sha256(body)}`)
  // ---------------------------

  private async sha256Hex(text: string): Promise<string> {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async hmacSha256Hex(secret: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private makeNonce(): string {
    // nonce >= 12 chars (tu backend exige eso)
    if ((crypto as any).randomUUID) return (crypto as any).randomUUID();
    return (Math.random().toString(36).slice(2) + Date.now().toString(36)).padEnd(12, 'x');
  }

  private async makeSignedHeaders(bodyObj: any): Promise<Record<string, string>> {
    const secret = SIGNING_SECRET;
    if (!secret) {
      // Si no hay secret, el backend devolverá SIGNING_SECRET_not_set o firma inválida
      // Igual damos error claro al usuario
      throw new Error('Falta SIGNING_SECRET. Guarda tu secret en localStorage("SIGNING_SECRET").');
    }

    const ts = Date.now().toString();
    const nonce = this.makeNonce();

    const bodyJson = JSON.stringify(bodyObj ?? {});
    const bodyHash = await this.sha256Hex(bodyJson);

    const base = `${ts}.${nonce}.POST.${PATH_DNI}.${bodyHash}`;
    const sig = await this.hmacSha256Hex(secret, base);

    return {
      'x-ts': ts,
      'x-nonce': nonce,
      'x-sig': sig
    };
  }

  // ---------------------------
  // Parse / normalize (robusto)
  // ---------------------------
  private pickFaceB64(anyPayload: any): string | null {
    const candidates = [
      anyPayload?.imagenes,
      anyPayload?.data?.imagenes,
      anyPayload?.result?.imagenes,
      anyPayload?.payload?.imagenes,
      anyPayload?.info?.imagenes,
    ].filter(Boolean);

    for (const c of candidates) {
      if (Array.isArray(c)) {
        const face = c.find((x: any) => (x?.tipo || '').toString().toLowerCase() === 'face' && x?.data);
        if (face?.data) return face.data;
      }
    }
    return null;
  }

  private normalize(payload: any): ReniecInfo | null {
    const root =
      payload?.info ??
      payload?.data ??
      payload?.result ??
      payload?.payload ??
      payload ??
      null;

    if (!root) return null;

    const dni = root?.dni ?? payload?.dni ?? null;
    const nombres = root?.nombres ?? root?.nombre ?? null;

    if (!dni && !nombres) return null;

    const info: ReniecInfo = {
      dni: dni?.toString(),
      nombres: root?.nombres ?? root?.nombre,
      apellido_paterno: root?.apellido_paterno ?? root?.ap_paterno ?? root?.paterno,
      apellido_materno: root?.apellido_materno ?? root?.ap_materno ?? root?.materno,
      sexo: root?.sexo,
      genero: root?.genero,

      fecha_nacimiento: root?.fecha_nacimiento ?? root?.nacimiento,
      fecha_emision: root?.fecha_emision ?? root?.emision,
      fecha_caducidad: root?.fecha_caducidad ?? root?.caducidad,
      fecha_inscripcion: root?.fecha_inscripcion ?? root?.inscripcion,

      distrito_n: root?.distrito_n,
      provincia_n: root?.provincia_n,
      departamento_n: root?.departamento_n,

      estatura: root?.estatura,
      estado_civil: root?.estado_civil,
      grado_instruccion: root?.grado_instruccion,
      restriccion: root?.restriccion,

      padre: root?.padre,
      madre: root?.madre,

      direccion_n: root?.direccion_n ?? root?.direccion,
      distrito: root?.distrito,
      provincia: root?.provincia,
      departamento: root?.departamento,

      ubigeo_reniec: root?.ubigeo_reniec,
      ubigeo_inei: root?.ubigeo_inei,
      ubigeo_sunat: root?.ubigeo_sunat,
      codigo_postal: root?.codigo_postal,
    };

    const face = this.pickFaceB64(payload);
    if (face) info.face_b64 = face;

    return info;
  }

  // ---------------------------
  // UI helpers
  // ---------------------------
  faceSrc(): string | null {
    if (!this.info?.face_b64) return null;
    return `data:image/jpeg;base64,${this.info.face_b64}`;
  }

  nextAdMock() {
    this.adTitle = 'ANUNCIO';
    this.adText  = 'Placeholder: aquí pondrás anuncios rotativos.';
  }

  // ---------------------------
  // MAIN: consultar DNI
  // ---------------------------
  async consultarDni() {
    this.errorMsg = '';
    this.info = null;

    const clean = onlyDigits(this.dni);
    if (clean.length !== 8) {
      this.errorMsg = 'DNI inválido. Debe tener 8 dígitos.';
      return;
    }

    // Cooldown cliente (10s)
    const now = Date.now();
    if (now < this.nextAllowedAt) {
      const s = Math.ceil((this.nextAllowedAt - now) / 1000);
      this.errorMsg = `Espera ${s}s para consultar nuevamente.`;
      return;
    }

    this.loading = true;

    try {
      const body = { dni: clean };
      const signed = await this.makeSignedHeaders(body);

      const headers = new HttpHeaders({
        ...signed,
        'Content-Type': 'application/json'
      });

      const payload: any = await this.http.post(API_URL_DNI, body, { headers }).toPromise();

      const parsed = this.normalize(payload);

      this.loading = false;

      // Cuando termina la consulta: anuncio 3s y luego resultado
      this.showAd = true;
      setTimeout(() => {
        this.showAd = false;

        if (!parsed) {
          this.errorMsg = 'No se encontró resultado.';
          this.info = null;
          return;
        }
        this.info = parsed;
      }, 3000);

      // set next allowed time
      this.nextAllowedAt = Date.now() + 10_000;

    } catch (e: any) {
      this.loading = false;
      this.showAd = false;

      // Mensajes más claros si el backend responde JSON
      const status = e?.status;
      const reason = e?.error?.reason;
      const msg = e?.error?.msg;

      if (status === 401) {
        this.errorMsg = `Firma inválida (401). ${reason ? `Reason: ${reason}` : ''}`.trim();
      } else if (status === 429) {
        this.errorMsg = msg || 'Demasiado rápido (429). Espera 10s.';
      } else if (status === 403) {
        this.errorMsg = msg || 'Acceso restringido (403).';
      } else {
        this.errorMsg = msg || 'Error consultando el DNI.';
      }
    }
  }
}
