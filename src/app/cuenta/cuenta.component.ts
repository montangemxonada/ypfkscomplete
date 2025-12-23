import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiLogService } from '../api-log.service';
import { CommonModule } from '@angular/common';
import { ApisService } from '../apis.service';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss'
})
export class CuentaComponent {
  monto: any = '';
  titular: any = '';
  tel: any = '';
  email_usuario: any = '';
  token_auto: any = '';
  token_sms: any = '';

  corr: boolean = false;
  anuncio: boolean = true;
  auto: boolean = false;
  sms: boolean = false;
  historial: boolean = false;

  respuesta: string = '';
  cargando: boolean = false;

  cantidadSms: number = 0;
  cantidadAuto: number = 0;
  cantidadYapeos: number = 0;

  tokenSmsActivo: boolean = false;
  tokenAutoActivo: boolean = false;

  localSms: boolean = false;
  showUpdateNotication = false;

  constructor(
    private router: Router,
    private api: ApisService,
    private apiSecurity: ApiLogService
  ) {}

  ngOnInit() {
    this.verificar();

    this.corr = JSON.parse(localStorage.getItem('corr') || 'false');
    this.anuncio = JSON.parse(localStorage.getItem('anuncio') || 'true');

    this.email_usuario = localStorage.getItem('email_usuario');
    this.titular = localStorage.getItem('titular');
    this.tel = localStorage.getItem('tel');
    this.monto = localStorage.getItem('monto');

    const localSms = localStorage.getItem('localSms');
    this.localSms = localSms ? JSON.parse(localSms) : false;
    if (!localSms) {
      localStorage.setItem('localSms', JSON.stringify(true));
    }
  }

  triggerUpdateNotification() {
    this.showUpdateNotication = true;
  }

  atras() {
    this.router.navigate(['/home']);
  }

  guardarNumero() {
    const userx = localStorage.getItem('user-data-xmwiizz');
    if (!userx) return;

    const telefono = localStorage.getItem('tel');
    const data = JSON.parse(userx);

    if (this.tel == telefono) {
      this.respuesta = 'Ya tienes el número en tu cuenta';
    } else if (
      data.usuario?.username &&
      data.usuario?.password &&
      data.usuario?.seller_id &&
      this.tel
    ) {
      this.api
        .guardarTelCuenta(
          data.usuario.username,
          data.usuario.password,
          data.usuario.seller_id,
          this.tel
        )
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.respuesta = 'Número registrado satisfactoriamente';
              localStorage.setItem('tel', this.tel);
            } else {
              this.respuesta = response.error;
            }
          },
          error: (err) => {
            this.respuesta = err.error?.error ?? 'Error inesperado';
          },
        });
    }
  }

  verificar() {
    const userDataString = localStorage.getItem('user-data-xmwiizz');
    if (!userDataString) return;

    const data = JSON.parse(userDataString);
    const { username, password, seller_id } = data.usuario;

    this.api.verificarTokens(seller_id, username, password).subscribe((response) => {
      // parsear con defensiva
      this.cantidadSms = Math.max(0, Number(response?.consultas ?? 0));
      this.cantidadAuto = Math.max(0, Number(response?.dias_restantes ?? 0));
      this.cantidadYapeos = Math.max(0, Number(response?.cantidad_yapeos ?? 0));

      this.tokenAutoActivo = !!response?.tokenAutoActivo && this.cantidadAuto > 0;
      this.tokenSmsActivo = !!response?.tokenSmsActivo && this.cantidadSms > 0;

      if (this.tokenAutoActivo) {
        const backendAuto = response?.token_auto ?? '';
        if (backendAuto) {
          this.token_auto = backendAuto;
          localStorage.setItem('token_auto', backendAuto);
        } else {
          this.token_auto = '';
          localStorage.removeItem('token_auto');
        }
      } else {
        this.token_auto = '';
        localStorage.removeItem('token_auto');
      }

      if (this.tokenSmsActivo) {
        const backendSms = response?.token_sms ?? '';
        if (backendSms) {
          this.token_sms = backendSms;
          localStorage.setItem('token_sms', backendSms);
        } else {
          this.token_sms = '';
          localStorage.removeItem('token_sms');
        }
      } else {
        this.token_sms = '';
        localStorage.removeItem('token_sms');
      }
    });
  }

  activarCorreo() {
    const email = (this.email_usuario || '').trim();
    if (!this.corr) {
      if (!email) {
        this.cargando = false;
        this.respuesta = 'No ingresaste el correo';
        return;
      }
      this.corr = true;
      localStorage.setItem('corr', JSON.stringify(this.corr));
      localStorage.setItem('email_usuario', email);
      this.respuesta = 'Constancias a correo activadas';
    } else {
      this.corr = false;
      localStorage.setItem('corr', JSON.stringify(this.corr));
    }
  }

  activarAuto() {
    if (this.tokenAutoActivo) return;

    this.cargando = true;
    this.respuesta = 'Cargando...';
    const userDataString = localStorage.getItem('user-data-xmwiizz');
    if (!userDataString) return;

    const { username, password, seller_id } = JSON.parse(userDataString).usuario;

    this.api
      .registrarTokenAuto(this.token_auto, username, password, seller_id)
      .pipe(
        catchError(() => {
          this.cargando = false;
          this.respuesta = 'Error de conexión con el servidor';
          return of(null);
        })
      )
      .subscribe((response) => {
        this.cargando = false;

        if (!response) {
          this.respuesta = 'TOKEN INEXISTENTE, COMPRA CON @SEBASRODRIGUES EN TELEGRAM';
          return;
        }

        this.respuesta = response.message;
        if (response.success) {
          const tokenDesdeBackend = response?.token_auto ?? this.token_auto ?? '';
          this.token_auto = tokenDesdeBackend;
          localStorage.setItem('token_auto', tokenDesdeBackend);
          this.tokenAutoActivo = true;
          window.location.reload();
        }
      });
  }

  activarSms() {
    if (!this.tokenSmsActivo) {
      this.cargando = true;
      this.respuesta = 'Cargando...';
      const userDataString = localStorage.getItem('user-data-xmwiizz');
      if (!userDataString) return;

      const { username, password, seller_id } = JSON.parse(userDataString).usuario;

      this.api
        .registrarTokenSms(this.token_sms, username, password, seller_id)
        .pipe(
          catchError(() => {
            this.cargando = false;
            this.respuesta = 'Error de conexión con el servidor';
            return of(null);
          })
        )
        .subscribe((response) => {
          this.cargando = false;

          if (!response) {
            this.respuesta = 'TOKEN INEXISTENTE, COMPRA CON @SEBASRODRIGUES EN TELEGRAM';
            return;
          }

          this.respuesta = response.message;
          if (response.success) {
            const tokenDesdeBackend = response?.token_sms ?? this.token_sms ?? '';
            this.token_sms = tokenDesdeBackend;
            localStorage.setItem('token_sms', tokenDesdeBackend);
            this.tokenSmsActivo = true;
            window.location.reload();
          }
        });
    } else {
      this.localSms = !this.localSms;
      localStorage.setItem('localSms', JSON.stringify(this.localSms));
    }
  }

  cerrar() {
    this.respuesta = '';
    this.cargando = false;
  }

  activarAnuncio() {
    this.anuncio = !this.anuncio;
  }

  borrarHistorial() {
    this.historial = !this.historial;
  }

  registrar() {
    localStorage.setItem('monto', this.monto);
    localStorage.setItem('titular', this.titular);
    localStorage.setItem('email_usuario', this.email_usuario);
    localStorage.setItem('anuncio', JSON.stringify(this.anuncio));
    localStorage.setItem('corr', JSON.stringify(this.corr));

    if (this.historial) {
      this.borrar();
    }

    const user_data = localStorage.getItem('user-data-xmwiizz');
    if (user_data) {
      const data = JSON.parse(user_data);

      this.api
        .sendRegister(
          data.usuario.username,
          data.usuario.password,
          data.usuario.seller_id,
          this.titular,
          this.monto
        )
        .subscribe(() => {
          this.corr = false;
          localStorage.setItem('corr', JSON.stringify(this.corr));
        });

      this.router.navigate(['/home']);
    }
  }

  borrar() {
    localStorage.removeItem('tsfn');
  }

  logOut() {
    const userDataString = localStorage.getItem('user-data-xmwiizz');
    if (!userDataString) return;

    const { username, password, seller_id } = JSON.parse(userDataString).usuario;

    this.apiSecurity.logOut(seller_id, username, password).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }
}
