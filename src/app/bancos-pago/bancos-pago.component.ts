import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreloadComponent } from '../preload/preload.component';
import { ApisService } from '../apis.service';
import { ApiLogService } from '../api-log.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-bancos-pago',
  standalone: true,
  providers: [],
  imports: [CommonModule, PreloadComponent, FormsModule],
  templateUrl: './bancos-pago.component.html',
  styleUrl: './bancos-pago.component.scss'
})
export class BancosPagoComponent {

  mostrarAlerta: boolean = false;
  monto: string = ""
  numero: any = null
  nombre: string = ""
  datos: any[] = []
  aparece: boolean = false;
  destino: string = ""
  forxx: string = ""
  codigo: string = ""
  codigoSeguridad: string = ''

  cargando: boolean = true;
  brands: string[] = [];
  existeYape: boolean = false;
  otrasEntidades: boolean = false
  mostrarPreload: boolean = false
  numeroaleatoriomostrar: string = "";
  mensaje: any = ''
  constructor(private route: ActivatedRoute, private router: Router, private api: ApisService, private logApi: ApiLogService) {
    this.route.queryParams.subscribe(params => {
      this.numero = params['numero']
      this.mensaje = params['mensaje']
      this.forxx = this.numero.slice(-3);
      this.monto = params['monto']
      this.deNumero = params['deNumero']
      this.deQr = params['deQr']
      this.deNuevo = params['deNuevo']
    
    });

    const datos_usuario = localStorage.getItem("user-data-xmwiizz")
    if (datos_usuario) {
      const user_data = JSON.parse(datos_usuario)

      const username = user_data.usuario.username
      const password = user_data.usuario.password
      const seller_id = user_data.usuario.seller_id

      // this.api.consultarInformacionPlin(this.numero, username, password, seller_id).subscribe((response) => {
      //   if (response.receiverName) {
      //     this.nombre_plin = response.receiverName
      //   }
      // })

      this.api.consultarBancosNew(seller_id, this.numero, username, password).subscribe({
        next: (res) => {
        this.cargando = false;
        this.brands = res.brands_disponibles || [];
        this.existeYape = this.brands.includes('YAPE');
        this.otrasEntidades = this.brands.some(b => b !== 'YAPE')
        if (this.brands.length === 0) {
          this.cargando = false;
          // this.errorMsg = 'No se encontraron marcas disponibles.';
        }
      },
      error: (err) => {
        this.cargando = false;
        // this.errorMsg = 'Error consultando marcas: ' + (err?.error?.message || err.message);
      }
    });
    }



  }
  ngOnInit() {
    const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.numeroaleatoriomostrar = '01' + numeroAleatorio;
    console.log(this.numeroaleatoriomostrar)
  }
  MostrarConsola(brand: string){
    console.log('Marca seleccionada:', brand);
  }
  buscar(brand: string) {
    this.mostrarPreload = true
    const userDataString = localStorage.getItem("user-data-xmwiizz")
    this.route.queryParams.subscribe(params => {
      if(params['numero']){
        this.numero = params['numero']
      }
    })

    if (userDataString) {
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id
    
  
      this.api.consultarInformacionBancos(this.numero, brand, username, password, seller_id).subscribe({
        next: res => {
          this.mostrarAlerta = true
          const nombre = this.formatReceiverName(this.capitalizeWords(res.receiverName))
          this.nombre = nombre
          this.destino =  brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
          this.mostrarPreload = false
        },
        error: err => {
          this.mostrarPreload = false
          // this.errorMsg = 'Error al consultar información del banco';
        }
      });
    }
  }
  openTab(typeX: string) {
    if (typeX.includes("bim")) {
      this.destino = "Bim"
      this.mostrarAlerta = true
    } else {
      this.destino = "Agora / Oh!"
      this.mostrarAlerta = true
    }
  }
  deNumero: boolean = false;
  deQr: boolean = false;
  deNuevo: boolean = false;
  confirmar() {
    const numeroaleatoriomostrar = this.numeroaleatoriomostrar
    const mensaje = this.mensaje
    const queryParams = { 
      nombre: this.nombre,
      numero: this.numero,
      destino: this.destino,
      mensaje: mensaje,
      numeroaleatoriomostrar,
      cantidad: this.monto,
      deNumero: this.deNumero,
      deNuevo: this.deNuevo,
      deQr: this.deQr,
    };
    this.mostrarPreload = true
    setTimeout(() => {
      this.mostrarPreload = false
      this.router.navigate(['/yapeo'], {queryParams});
    }, 2000)
  }

  cancelar(){
    this.mostrarAlerta = false
  }
  formatReceiverName(name: string): string {
    const words = name.split(' ');
  
    if (words.length === 3) {
      return `${words[0]} ${words[1]} ${words[2][0]}.`;
    } else if (words.length === 4) {
  
      return `${words[0]} ${words[1][0]}. ${words[2]} ${words[3][0]}.`;
    }
    return name;
  }
  private capitalizeWords(str: string): string {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    console.log(capitalizedWords)
    return capitalizedWords.join(" ");
  }
  private capitalizeFirstLetter(word: string): string {
    // Convertir solo la primera letra a mayúscula
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  homeComponente() {
    this.router.navigate(['/home']);
  }
  yapearComponente() {

    this.router.navigate(['/yapear']);
  }
}
