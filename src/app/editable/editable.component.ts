import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent {
  // Campos del formulario
  nombre: string = '';
  numero: string = '';          // 9 dígitos
  destino: string = 'Yape';     // string (no union) para evitar errores de type-check en <select>
  mensaje: string = '';         // vacío => se enviará 'Auto'
  monto: string = '';

  // Estado UI
  botonesHabilitados = false;
  mostrarPreload = false;

  // Operación (auto/manual)
  opManual = false;
  operacion: string = this.generarOperacion(); // "01" + 6 dígitos

  // Fecha/hora manual
  usarFechaManual = false;
  fechaDia: string = '';   // YYYY-MM-DD (input[type="date"])
  fechaHora: string = '';  // HH:mm (input[type="time"])

  constructor(
    private router: Router,
    private location: Location
  ) {}

  // Ajuste visual del input monto
  autoWidth(ev: Event) {
    const input = ev.target as HTMLInputElement;
    input.style.width = ((input.value.length + 1) * 9) + 'vw';
  }

  // Habilitar/deshabilitar botones según datos mínimos
  actualizarBotones() {
    const nombreOK = this.nombre?.trim().length > 0;
    const numeroOK = (this.numero || '').replace(/\D/g, '').length === 9; // exigir 9 dígitos
    const montoNum = this.parseMoney(this.monto);
    const montoOK = !isNaN(montoNum) && montoNum > 0;
    this.botonesHabilitados = nombreOK && numeroOK && montoOK;
  }

  // Parseo y formato dinero
  private toMoney2(v: string | number): string {
    const n = this.parseMoney(v);
    return isNaN(n) ? '0.00' : n.toFixed(2);
  }

  private parseMoney(v: string | number): number {
    if (v === null || v === undefined) return NaN;
    const s = String(v).replace(',', '.').replace(/[^\d.]/g, '');
    return parseFloat(s);
  }

  // N° operación: "01" + 6 dígitos
  generarOperacion(): string {
    const rand = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');
    return '01' + rand;
  }

  // Solo regenera si está en modo automático
  regenerarOperacion() {
    if (!this.opManual) {
      this.operacion = this.generarOperacion();
    }
  }

  // Formatea fecha manual al estilo de la pantalla final: "dd mes. yyyy - hh:mm a. m./p. m."
  private formatearFechaManual(diaISO: string, horaHHMM?: string): string {
    const iso = `${diaISO}T${(horaHHMM && horaHHMM.length >= 4) ? horaHHMM : '00:00'}`;
    const d = new Date(iso);

    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const dd = String(d.getDate()).padStart(2, '0');
    const mes = meses[d.getMonth()];
    const yyyy = d.getFullYear();

    let h = d.getHours();
    const m = d.getMinutes();
    const periodo = h < 12 ? ' a. m.' : ' p. m.';
    h = h % 12 || 12;

    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');

    return `${dd} ${mes}. ${yyyy} - ${hh}:${mm}${periodo}`;
  }

  // Navegación: botón "Yapear"
  yapeoComponent() {
    if (!this.botonesHabilitados) return;

    this.mostrarPreload = true;

    // En esta pantalla: yape a número
    const deQr = false;
    const deNumero = true;

    // Sanitizar número a 9 dígitos
    const numeroClean = (this.numero || '').replace(/\D/g, '').slice(0, 9);

    // Si no hay mensaje, la pantalla final mostrará "¡Te Yapearon!" usando 'Auto'
    const msg = this.mensaje && this.mensaje.trim().length > 0 ? this.mensaje.trim() : 'Auto';

    // N° operación (manual o auto)
    const nroOperacion = (this.opManual && this.operacion?.length >= 3)
      ? this.operacion
      : this.generarOperacion();

    const params: any = {
      nombre: this.nombre.trim(),
      numero: numeroClean,
      destino: this.destino,
      mensaje: msg,
      cantidad: this.toMoney2(this.monto),
      deQr,
      deNumero,
      numeroaleatoriomostrar: nroOperacion
    };

    // Si el usuario eligió fecha/hora manual, forzamos voucher='true' y enviamos 'fecha';
    // de lo contrario, voucher='false' para que la pantalla final calcule la fecha sola.
    if (this.usarFechaManual && this.fechaDia) {
      params.voucher = 'true';
      params.fecha = this.formatearFechaManual(this.fechaDia, this.fechaHora);
    } else {
      params.voucher = 'false';
    }

    this.router.navigate(['/yapeo'], { queryParams: params })
      .finally(() => this.mostrarPreload = false);
  }

  // Icono izquierda (volver)
  yapearComponente() {
    this.location.back();
  }

  // Icono derecha (home)
  homeComponente() {
    this.router.navigate(['/home']);
  }
}
