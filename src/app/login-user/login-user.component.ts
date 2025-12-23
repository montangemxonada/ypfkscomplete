import { Component } from '@angular/core';
import { ApiLogService } from '../api-log.service';
import { Router } from '@angular/router';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent {
  constructor(private el: ElementRef,private api: ApiLogService, private router: Router) {
    localStorage.clear()
    this.setup();

  }
  first: boolean = false;
  two: boolean = false;
  username: string = "";
  id_vendedor: string = "";
  password: string = "";
  message: string = "";
  intervalRef: any;
  sebas: string = '@SebasRodrigues'
  yapefake: string = '@YapeFake'
  appsfake: string = '@AppsFake'
  alertaInfo: boolean = true
  private isPassword = true;


  @HostListener('click') onClick() {
    this.isPassword = !this.isPassword;
    this.setup();
  }
  cerrarAlerta(){
    this.alertaInfo = false
  }
  abrirAlerta(){
    this.alertaInfo = true
  }
  nuevo(){
    this.router.navigate(["/registrar"])
  }
  private setup() {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    inputElement.type = this.isPassword ? 'password' : 'text';
  }
  changepassword(){
    this.router.navigate(["/change-password"])
  }
  onUsernameChange(event: any) {
    const raw = (event.target.value || '').trim();
    this.username = raw.startsWith('Y2-') ? raw : `Y2-${raw}`;
  }
  onPasswordChange(event: any) {
    this.password = event.target.value;
  }
  onIdChange(event: any) {
    this.id_vendedor = event.target.value;
  }

  showIntro = true;
  fadeOut = false;


  login() {
    this.first = true
    
    this.api.loginUsuario(Number(this.id_vendedor), this.username, this.password).subscribe((response) => {
      if (response.mensaje) {
        if (response.mensaje == "Inicio de sesión exitoso") {
          this.router.navigate(["/"])
          localStorage.setItem('user-data-xmwiizz', JSON.stringify(response));
          try {
            this.detenerIntervalo()
            this.two = false
          } catch { }

        } else {
          this.message = response.mensaje
        }
      } else {
        this.message = response.response
        if(this.message.includes("cierre la sesion")){
          this.router.navigate(["/change-password"])
        }
      }
      this.first = false
    })
  }

  register() {
    this.two = true;
  
    this.api.getIp().subscribe((ip) => {
      this.api.registrarUsuario(
        Number(this.id_vendedor),
        this.username,
        this.password,
        ip || '' // ✅ siempre string
      ).subscribe((response) => {
        if (response.response !== "User registrado correctamente") {
          this.message = response.response;
        } else {
          this.intervalRef = setInterval(() => { this.login() }, 1000);
        }
        this.two = false;
      });
    });
  }
  
  ngOnInit(): void {
    // Dura 5 segundos
    setTimeout(() => {
      this.fadeOut = true;
  
      // Espera el fade (1s) y luego quita el overlay
      setTimeout(() => {
        this.showIntro = false;
      }, 1000);
  
    }, 4000);
  }

  private detenerIntervalo() {
    clearInterval(this.intervalRef);
  }
}
