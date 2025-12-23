import { Component } from '@angular/core';
import { ApiLogService } from '../api-log.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cambiarpassword',
  standalone: true,
  imports: [],
  templateUrl: './cambiarpassword.component.html',
  styleUrl: './cambiarpassword.component.scss'
})
export class CambiarpasswordComponent {
  constructor(private api: ApiLogService, private router: Router) {
    localStorage.clear()
  }
  first: boolean = false;
  two: boolean = false;
  username: string = "";
  id_vendedor: string = "";
  password: string = "";
  message: string = "";
  intervalRef: any;
  newpassword: any = ""
  telegram: string = '@SEBASRODRIGUES'

  onUsernameChange(event: any) {
    this.username = `Y2-${event.target.value.trim()}`;
  }
  onPasswordChange(event: any) {
    this.password = event.target.value;
  }
  onIdChange(event: any) {
    this.id_vendedor = event.target.value;
  }
  onNewPasswordChange(event:any){
    this.newpassword = event.target.value
  }
  changePassword(){
    this.two = true
    this.api.cambiarContraseña(Number(this.id_vendedor), this.username, this.password, this.newpassword).subscribe((response)=>{
      this.message = response.mensaje
      this.two = false
    })
  }
  volver(){
    this.router.navigate(["/user"])
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
      }
      this.first = false
    })
  }

  private detenerIntervalo() {
    clearInterval(this.intervalRef);
  }
}
