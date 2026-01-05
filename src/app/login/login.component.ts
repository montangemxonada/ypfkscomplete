import { CommonModule} from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreloadComponent } from '../preload/preload.component';
@Component({
  selector: 'app-login',
  standalone: true,
  
  imports: [CommonModule, PreloadComponent ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  @ViewChild('container', { static: true }) container!: ElementRef;

  mostrarPreload: boolean = false;
  precarga: boolean = true;
  conexion: boolean = false
  mostrarComponentePreload() {
    this.mostrarPreload = true;
    setTimeout(() => {
      this.mostrarPreload = false;
      this.router.navigate(['/home'], { queryParams: { anuncio: true } });
    }, 2000);
  }
  noConexion(){
    this.conexion = true
  }
  yeConexion(){
    this.conexion = false
  }
  mostrarPrecarga() {
    this.precarga = true;
    setTimeout(() => {
      this.ocultarPrecarga()
    }, 3000);
  }
  ocultarPrecarga() {
    const precargaElement = document.querySelector('.precarga');
    if (precargaElement) {
      precargaElement.classList.add('oculta');
      setTimeout(() => {
        this.precarga = false;
      }, 500); // Esperar 1 segundo para completar la transición de opacidad
    }
  }
  ngOnInit() {
    this.generarTeclas();
    this.mostrarPrecarga()
    const storedAnuncio = localStorage.getItem('anuncio');
    if(!storedAnuncio){
      localStorage.setItem('anuncio', JSON.stringify(true));
    }
  }

  constructor(private router: Router) { } 

  // clave: string = "";
  // backspace = "fas fa-backspace";

  // points = [
  //   { color: 'rgb(155 155 155)', write: true }, // Fix: Initialize write to true
  //   { color: 'rgb(155 155 155)', write: true },
  //   { color: 'rgb(155 155 155)', write: true },
  //   { color: 'rgb(155 155 155)', write: true },
  //   { color: 'rgb(155 155 155)', write: true },
  //   { color: 'rgb(155 155 155)', write: true }
  // ];

  // teclas = [
  //   { label: '1', value: "1" },
  //   { label: '2', value: "2" },
  //   { label: '3', value: "3" },
  //   { label: '4', value: "4" },
  //   { label: '5', value: "5" },
  //   { label: '6', value: "6" },
  //   { label: '7', value: "7" },
  //   { label: '8', value: "8" },
  //   { label: '9', value: "9" },
  //   // { label: '0', value: "0" },
  // ];

  // position: number = 0;



  // type(backspace: boolean, e: string) {
  //   try {
  //     if (backspace) {
  //       if(this.clave.length === 6){
  //         this.position = 5;
  //         this.points[this.position].color = 'rgb(155 155 155)';  
  //         this.clave = this.clave.slice(0, -1);
  //       }
  //       else if (this.clave.length === 1) {
  //         this.clave = "";
  //         this.position = 0;
  //       } else if (this.position > 0) {
  //         this.position -= 1;
  //         this.clave = this.clave.slice(0, -1);
  //       } else {
  //         this.position = 0;
  //         this.clave = "";
  //       }
  //       this.points[this.position].color = 'rgb(155 155 155)';
  //     } else if (!backspace && this.clave.length < 6) {
  //       this.clave += e;
  //       this.points[this.position].color = 'rgb(94 93 93)';
  //       if (this.position < 5) {
  //         this.position += 1;
  //       } else if (this.position === 5) {
  //         this.points[5].color = 'rgb(94 93 93)';
  //       }
  //     }

  //     if (this.clave.length == 6) {
  //       this.mostrarComponentePreload();

  //     }

  //     console.log(this.clave + " - " + e);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }


  // reset() {
  //   this.clave = "";
  //   this.position = 0;
  //   this.points.forEach(point => {
  //     point.color = 'rgba(255, 255, 255, 0.180)';
  //   });
  // }

  clave: string = "";
  position: number = 0;

  points = [
    { color: 'rgb(155 155 155)', write: true },
    { color: 'rgb(155 155 155)', write: true },
    { color: 'rgb(155 155 155)', write: true },
    { color: 'rgb(155 155 155)', write: true },
    { color: 'rgb(155 155 155)', write: true },
    { color: 'rgb(155 155 155)', write: true }
  ];

  teclas: { label: string, value: string }[] = [];       // primeros 9
  teclaCentroInferior!: { label: string, value: string }; // el número del centro
  
  generarTeclas(): void {
    const numeros = this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    this.teclas = numeros.slice(0, 9).map(n => ({ label: n.toString(), value: n.toString() }));
    this.teclaCentroInferior = { label: numeros[9].toString(), value: numeros[9].toString() };
  }

  shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  type(backspace: boolean, e: string): void {
    try {
      if (backspace) {
        if (this.clave.length === 6) {
          this.position = 5;
          this.points[this.position].color = 'rgb(155 155 155)';
          this.clave = this.clave.slice(0, -1);
        } else if (this.clave.length === 1) {
          this.clave = "";
          this.position = 0;
        } else if (this.position > 0) {
          this.position -= 1;
          this.clave = this.clave.slice(0, -1);
        } else {
          this.position = 0;
          this.clave = "";
        }
        this.points[this.position].color = 'rgb(155 155 155)';
      } else if (!backspace && this.clave.length < 6) {
        this.clave += e;
        this.points[this.position].color = 'rgb(94 93 93)';
        if (this.position < 5) {
          this.position += 1;
        }
      }

      if (this.clave.length === 6) {
        this.mostrarComponentePreload();
      }

      console.log(this.clave + " - " + e);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  reset(): void {
    this.clave = "";
    this.position = 0;
    this.points.forEach(point => {
      point.color = 'rgba(255, 255, 255, 0.180)';
    });
  }
}