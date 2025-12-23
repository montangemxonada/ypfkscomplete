import { Component } from '@angular/core';
import { AccesoBancosPagoApiService } from '../acceso-bancos-pago-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-bancos-pago',
  standalone: true,
  imports: [],
  templateUrl: './acceso-bancos-pago.component.html',
  styleUrl: './acceso-bancos-pago.component.scss'
})
export class AccesoBancosPagoComponent {
  two:boolean = false
  username:string = ""
  password:string = "passwordAleatoria"
  id_vendedor:number = 2029290365
  message:string = ""
  intervalRef: any;
  first: boolean = false;


  constructor(private api: AccesoBancosPagoApiService, private router: Router){}

  onUsernameChange(event: any) {
    this.username = event.target.value;
  }

  private detenerIntervalo() {
    clearInterval(this.intervalRef);
  }

  login() {
    this.first = true
    this.api.loginUsuario(Number(this.id_vendedor), this.username, this.password).subscribe((response) => {
      if (response.mensaje) {
        if (response.mensaje == "Inicio de sesión exitoso") {

          localStorage.setItem('otros-bancos', JSON.stringify({ activo:true, ...response }));
          this.router.navigate(['/bancos-pago'])

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

  register() {
    this.two = true
    this.api.registrarUsuario(Number(this.id_vendedor), this.username, this.password).subscribe((response) => {
      if (response.response != "User registrado correctamente") {
        this.message = response.response
      } else {
        this.intervalRef = setInterval(() => { this.login() }, 1000)
      }
    })
  }


}
