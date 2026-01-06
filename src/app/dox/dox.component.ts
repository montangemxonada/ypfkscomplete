import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';

const API_URL_DNI = 'https://apidxyape.onrender.com/api/dni';

function onlyDigits(v: string) { return (v ?? '').replace(/[^0-9]/g, ''); }

type ApiImage = {
  tipo?: string;   // face | fingerprint | signature | ...
  data?: string;   // base64 sin prefijo
};

type UiImage = {
  tipo: string;       // normalizado
  label: string;      // "Rostro", "Huella", "Firma"
  src: string;        // data:image/jpeg;base64,...
};

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

  // ✅ imágenes ya listas para UI
  images?: UiImage[];
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

  // anuncio placeholder (luego lo rotas)
  adTitle = 'ANUNCIO';
  adText  = ' (3s).';

  // Selección de vista (opcional para tu HTML): "datos" | "imagenes"
  view: 'datos' | 'imagenes' = 'datos';

  constructor(private http: HttpClient) {}

  back() { history.back(); }

  onDniInput(v: string) {
    this.dni = onlyDigits(v).slice(0, 8);
  }

  // ---------------------------
  // Utilidades imágenes
  // ---------------------------
  private normalizeTipo(t: any): string {
    const s = String(t || '').toLowerCase().trim();
    // normaliza posibles variantes
    if (s.includes('face') || s.includes('rostro')) return 'face';
    if (s.includes('finger') || s.includes('huella') || s.includes('dact')) return 'fingerprint';
    if (s.includes('sign') || s.includes('firma')) return 'signature';
    return s || 'image';
  }

  private labelTipo(tipo: string): string {
    switch (tipo) {
      case 'face': return 'Rostro';
      case 'fingerprint': return 'Huella';
      case 'signature': return 'Firma';
      default: return tipo.toUpperCase();
    }
  }

  private guessMimeFromB64(b64: string): string {
    // la mayoría es jpeg. Esto es un “best effort”.
    const head = (b64 || '').slice(0, 10);
    if (head.startsWith('iVBOR')) return 'image/png';
    return 'image/jpeg';
  }

  private toUiImages(images: ApiImage[] | undefined | null): UiImage[] {
    if (!Array.isArray(images)) return [];

    const mapped = images
      .filter(x => x && x.data)
      .map((x) => {
        const tipo = this.normalizeTipo(x.tipo);
        const mime = this.guessMimeFromB64(String(x.data || ''));
        return {
          tipo,
          label: this.labelTipo(tipo),
          src: `data:${mime};base64,${String(x.data)}`
        } as UiImage;
      });

    // Orden bonito: face, fingerprint, signature, resto
    const order = { face: 0, fingerprint: 1, signature: 2 };
    mapped.sort((a, b) => (order[a.tipo as keyof typeof order] ?? 99) - (order[b.tipo as keyof typeof order] ?? 99));

    return mapped;
  }

  // ---------------------------
  // Parse / normalize payload
  // ---------------------------
  private normalize(payload: any): ReniecInfo | null {
    // Caso 1: formato "listaani" = [{dni:"..."},{nombres:"..."},... , {imagenes:[...] }]
    if (Array.isArray(payload?.listaani)) {
      const merged: any = {};
      for (const item of payload.listaani) {
        if (item && typeof item === 'object') Object.assign(merged, item);
      }

      if (!merged?.dni && !merged?.nombres && !merged?.nombre) return null;

      const images = this.toUiImages(merged?.imagenes);

      return {
        dni: merged.dni?.toString(),
        nombres: merged.nombres ?? merged.nombre,
        apellido_paterno: merged.apellido_paterno ?? merged.ap_paterno ?? merged.paterno,
        apellido_materno: merged.apellido_materno ?? merged.ap_materno ?? merged.materno,
        sexo: merged.sexo,
        genero: merged.genero,

        fecha_nacimiento: merged.fecha_nacimiento ?? merged.nacimiento,
        fecha_emision: merged.fecha_emision ?? merged.emision,
        fecha_caducidad: merged.fecha_caducidad ?? merged.caducidad,
        fecha_inscripcion: merged.fecha_inscripcion ?? merged.inscripcion,

        distrito_n: merged.distrito_n,
        provincia_n: merged.provincia_n,
        departamento_n: merged.departamento_n,

        estatura: merged.estatura,
        estado_civil: merged.estado_civil,
        grado_instruccion: merged.grado_instruccion,
        restriccion: merged.restriccion,

        padre: merged.padre,
        madre: merged.madre,

        direccion_n: merged.direccion_n ?? merged.direccion,
        distrito: merged.distrito,
        provincia: merged.provincia,
        departamento: merged.departamento,

        ubigeo_reniec: merged.ubigeo_reniec,
        ubigeo_inei: merged.ubigeo_inei,
        ubigeo_sunat: merged.ubigeo_sunat,
        codigo_postal: merged.codigo_postal,

        images
      };
    }

    // Caso 2: otros formatos más “normales”
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

    const images = this.toUiImages(root?.imagenes ?? payload?.imagenes);

    return {
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

      images
    };
  }

  // ---------------------------
  // MAIN: consultar DNI (lite, sin x-ts)
  // ---------------------------
  async consultarDni() {
    this.errorMsg = '';
    this.info = null;
    this.view = 'datos';

    const clean = onlyDigits(this.dni);
    if (clean.length !== 8) {
      this.errorMsg = 'DNI inválido. Debe tener 8 dígitos.';
      return;
    }

    this.loading = true;

    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = { dni: clean };

      const payload = await firstValueFrom(
        this.http.post<any>(API_URL_DNI, body, { headers }).pipe(timeout(20000))
      );

      const parsed = this.normalize(payload);

      this.loading = false;

      this.showAd = true;
      setTimeout(() => {
        this.showAd = false;

        if (!parsed) {
          this.errorMsg = 'No se encontró resultado.';
          return;
        }
        this.info = parsed;
        this.showAllImages = false;

        // si hay imágenes, por defecto muestra datos pero tú puedes cambiarlo
        // this.view = parsed.images?.length ? 'imagenes' : 'datos';
      }, 3000);

    } catch (e: any) {
      this.loading = false;
      this.showAd = false;

      if (e instanceof TimeoutError) {
        this.errorMsg = 'Tiempo de espera agotado (timeout).';
        return;
      }

      if (e instanceof HttpErrorResponse) {
        const msg = e.error?.msg || e.message;
        const reqId = e.error?.reqId;
        this.errorMsg = reqId ? `${msg} (reqId: ${reqId})` : msg;
        return;
      }

      this.errorMsg = 'Error consultando el DNI.';
    }
  }
  faceSrc(): string | null {
  const face = this.info?.images?.find(x => x.tipo === 'face');
  return face?.src || null;
}
nextAdMock() {
  // luego aquí harás rotación real de anuncios
  this.adTitle = 'ANUNCIO';
  this.adText  = 'Placeholder: aquí pondrás anuncios rotativos.';
}
showAllImages = false;

toggleImages(v: boolean) {
  this.showAllImages = v;
}

nonFaceImages() {
  const imgs = this.info?.images || [];
  return imgs.filter(x => x.tipo !== 'face');
}

stackedImages() {
  // en la baraja solo mostramos máximo 4 para que se vea bonito
  return this.nonFaceImages().slice(0, 4);
}



}
