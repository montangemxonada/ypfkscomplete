import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertabComponent } from '../alertab/alertab.component';
import { ApisService } from '../apis.service';
import { ApiLogService } from '../api-log.service';

@Component({
  selector: 'app-bancos',
  standalone: true,
  imports: [CommonModule, AlertabComponent],
  templateUrl: './bancos.component.html',
  styleUrl: './bancos.component.scss'
})
export class BancosComponent {
  mostrarAlerta: boolean = false;
  monto: string = ""
  numero: any = null
  nombre: string = ""
  datos: any[] = []
  aparece: boolean = false
  constructor(private route: ActivatedRoute, private router: Router, private api: ApisService, private apiLogs: ApiLogService) {

    this.route.queryParams.subscribe(params => {
      this.numero = Number(params['numero'])
      this.monto = params['monto']
    });
    const userDataString = localStorage.getItem("user-data-xmwiizz");
    if (userDataString) {
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id

      this.api.consultarInformacionPlin(this.numero, username, password, seller_id).subscribe(

        (response: any) => {
          this.nombre = this.capitalizeWords(response.receiverName)
          this.aparece = true
        },
        (error: any) => {
          this.aparece = false
        })


    }
  }
  private capitalizeWords(str: string): string {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    console.log(capitalizedWords)
    return capitalizedWords.join(" ");
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  homeComponente() {
    this.router.navigate(['/home']);
  }
  yapearComponente() {

    this.router.navigate(['/yapear']);
  }
  confirmar() {
    this.mostrarAlerta = true
  }
  confirmar_bancos_pago() {
    this.router.navigate(['/bancos-pago'])
    //this.router.navigate(['/login-bancos-pago'])
  }
}
