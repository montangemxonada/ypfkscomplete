import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MontoComponent } from './monto/monto.component';
import { YapeoComponent } from './yapeo/yapeo.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { YapearComponent } from './yapear/yapear.component';
import { BancosComponent } from './bancos/bancos.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { AlertabComponent } from './alertab/alertab.component';
import { PreloadComponent } from './preload/preload.component';
import { RecargarComponent } from './recargar/recargar.component';
import { RecmontoComponent } from './recmonto/recmonto.component';
import { LoginSecurityGuard } from './login-security.guard';
import { RecargadoComponent } from './recargado/recargado.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { BancosPagoComponent } from './bancos-pago/bancos-pago.component';
import { CambiarpasswordComponent } from './cambiarpassword/cambiarpassword.component';
import { AccesoBancosPagoComponent } from './acceso-bancos-pago/acceso-bancos-pago.component';
import { LimpiartransferenciasComponent } from './limpiartransferencias/limpiartransferencias.component';
import { EditableComponent } from './editable/editable.component';
import { YapeoEditadoComponent } from './yapeo-editado/yapeo-editado.component';
import { RegistrarUserComponent } from './registrar-user/registrar-user.component';
import { ContactosComponent } from './contactos/contactos.component';
import { QrContactoComponent } from './qr-contacto/qr-contacto.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { MultipleComponent } from './multiple/multiple.component';
import { TerminosComponent } from './terminos/terminos.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';

export const routes: Routes = [

    { path: '', component: LoginComponent, canActivate: [LoginSecurityGuard] }, // 
    { path: 'home', component: HomeComponent, canActivate: [LoginSecurityGuard] },
    { path: 'yapeo', component: YapeoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'qrcode', component: QrcodeComponent, canActivate: [LoginSecurityGuard] },
    { path: 'yapear', component: YapearComponent, canActivate: [LoginSecurityGuard] },
    { path: 'monto', component: MontoComponent , canActivate: [LoginSecurityGuard] },
    { path: 'bancos', component: BancosComponent , canActivate: [LoginSecurityGuard] },
    { path: 'cuenta', component: CuentaComponent, canActivate: [LoginSecurityGuard] },
    { path: 'recargar', component: RecargarComponent, canActivate: [LoginSecurityGuard] },
    { path: 'recmonto', component: RecmontoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'recargado', component: RecargadoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'bancos-pago', component: BancosPagoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'login-bancos-pago', component: AccesoBancosPagoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'editable', component: EditableComponent, canActivate: [LoginSecurityGuard] },
    { path: 'yapeo-editado', component: YapeoEditadoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'servicios', component: ServiciosComponent, canActivate: [LoginSecurityGuard]},
    { path: 'contactos', component: ContactosComponent, canActivate: [LoginSecurityGuard] },
    { path: 'qrcontacto', component: QrContactoComponent, canActivate: [LoginSecurityGuard] },
    { path: 'multiple', component: MultipleComponent, canActivate:[LoginSecurityGuard]},
    { path: 'notificaciones', component: NotificacionesComponent, canActivate:[LoginSecurityGuard]},
    { path: 'limpiar', component:  LimpiartransferenciasComponent},
    { path: 'change-password',component: CambiarpasswordComponent},
    { path: 'user', component: LoginUserComponent},
    { path: 'registrar', component: RegistrarUserComponent},
    { path: 'terminos', component: TerminosComponent},
    { path: '**', redirectTo:'home' }

];
