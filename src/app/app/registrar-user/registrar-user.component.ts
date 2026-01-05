import { Component } from '@angular/core';
import { ApiLogService } from '../api-log.service';
import { Router } from '@angular/router';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registrar-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registrar-user.component.html',
  styleUrl: './registrar-user.component.scss'
})
export class RegistrarUserComponent {
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
  alertaInfo: boolean = false
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
  private setup() {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    inputElement.type = this.isPassword ? 'password' : 'text';
  }
  user(){
    this.router.navigate(["/user"])
  }
  nuevo(){
    this.router.navigate(["/registrar"])
  }
  onUsernameChange(event: any) {
    this.username = `Y2-${event.target.value.trim()}`;
  }
  onPasswordChange(event: any) {
    this.password = event.target.value;
  }
  onIdChange(event: any) {
    this.id_vendedor = event.target.value;
  }

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
        ip
      ).subscribe((resp) => {
        if (resp.response != "User registrado correctamente") {
          this.message = resp.response;
          this.two = false;
        } else {
          this.intervalRef = setInterval(() => { this.login() }, 5000);
        }
      });
    });}
  

  private detenerIntervalo() {
    clearInterval(this.intervalRef);
  }
}
