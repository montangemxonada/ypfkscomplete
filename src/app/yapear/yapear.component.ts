import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PreloadComponent } from '../preload/preload.component';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-yapear',
  standalone: true,
  imports: [CommonModule, PreloadComponent ],
  templateUrl: './yapear.component.html',
  styleUrl: './yapear.component.scss'
})
export class YapearComponent {

  mostrarPreload: boolean = false;
  numero:string = ""
  nombre:string = ""
  incomplete: boolean = true;
  complete: boolean = false;
  contactosFiltrados: any[] = [];
  
  contactos = [
    { nombre: 'Abel Yovani', numero: '951346842' },
    { nombre: 'Antony Pablo Soria', numero: '946651056' },
    { nombre: 'Christian Velez', numero: '909150468' },
    { nombre: 'Jorge Santos', numero: '956459001' },
    { nombre: 'Juan Carlos Martínez López', numero: '989591314' },
    { nombre: 'Lucía Fernández García', numero: '922045770' },
    { nombre: 'Pedro Antonio', numero: '996014267' },
    { nombre: 'Sofía Elena Saavedra', numero: '921146379' },
    { nombre: 'Sebastian Morales', numero: '976735065' },
    { nombre: 'Toledo Rodriguez', numero: '9671840900' },
    { nombre: 'BloSpy', numero: '912233421' },
    { nombre: 'Yamsito', numero: '969460705' },
  ];
  constructor(private router: Router, private api: ApisService) {
    this.contactosFiltrados = [...this.contactos]
  }
  homeComponente() {
    this.router.navigate(['/home']);
  }

  // onChangeNumber(event: any ) {
  //   this.numero = event.target.value
  // }

  onChangeNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    this.numero = input.value.replace(/\D/g, ''); // Solo números
    
    // Filtrar contactos mientras se escribe
    this.filtrarContactos();
    
    // Cambiar vista cuando tenga 9 dígitos
    if (this.numero.length === 9) {
      this.incomplete = false;
      this.complete = true;
    } else {
      this.incomplete = true;
      this.complete = false;
    }
  }
  private filtrarContactos() {
    if (!this.numero) {
      this.contactosFiltrados = [...this.contactos];
      return;
    }
    
    this.contactosFiltrados = this.contactos.filter(contacto => 
      contacto.numero.includes(this.numero) || 
      contacto.nombre.toLowerCase().includes(this.numero.toLowerCase())
    );
  }
  formatNumber(value: any): string {
    const num = value?.numero ? value.numero.toString() : value.toString();
    const cleaned = num.replace(/\D/g, '');
    return cleaned.length === 9 ? cleaned.replace(/(\d{3})(?=\d)/g, '$1 ') : num;
  }
  mostrarComponentePreload() {
    
  }
  deNumero: boolean = false
  yapearNo(){
    // this.mostrarComponentePreload();
    const numero = this.numero
    const telefono = this.numero
    const deNumero = true
    const queryParams = { deNumero, numero: `${numero}`, telefono: `${telefono}` };
    this.router.navigate(['/monto'], { queryParams});
  }
  editar(){
    this.router.navigate(['/editable'])
  }

  yapear() {
    this.mostrarPreload = true;
    const userDataString = localStorage.getItem("user-data-xmwiizz")

    if (userDataString) {
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id

      this.api.consultarInformacionYape(this.numero, username, password, seller_id).subscribe(
        (response: any) => {
          const nombre = this.formatReceiverName(this.capitalizeWords(response.receiverName))
          const numero = this.numero
          const telefono = this.numero
          const deNumero = true
          const queryParams = { deNumero, nombre, numero: `${numero}`, telefono: `${telefono}` };
          this.router.navigate(['/monto'], { queryParams});
          this.mostrarPreload = false
        },
        (error: any) => {
          const nombre = ''
          const numero = this.numero
          const telefono = this.numero
          const deNumero = true
          const queryParams = { deNumero, nombre, numero: `${numero}`, telefono: `${telefono}` };
          this.router.navigate(['/monto'], { queryParams});
          this.mostrarPreload = false
        })
    }
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
}
