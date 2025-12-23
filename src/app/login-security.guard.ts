import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiLogService } from './api-log.service';

@Injectable({
  providedIn: 'root',
})
export class LoginSecurityGuard implements CanActivate {

  username: any = "";
  id_vendedor: any = 0;

  constructor(private router: Router, private api: ApiLogService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const userDataString = localStorage.getItem("user-data-xmwiizz");
    if (userDataString) {
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id

      this.api.loginUsuario(seller_id, username, password).subscribe((response) => {
        if (response.response == "Primero cierre la sesion en su otro dispositivo" || response.response == "Inicio de sesión exitoso") {
          return true
        } else {
          localStorage.clear()
          this.router.navigate(["/user"])
          return false
        }
      })

    } else {
      localStorage.clear()
      this.router.navigate(["/user"])
      return false
    }
  }
}
