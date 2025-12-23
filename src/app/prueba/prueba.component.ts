import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import Instascan from 'instascan';

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.scss'
})
export class PruebaComponent implements OnInit {
  @ViewChild('preview', { static: true })
  preview!: ElementRef;

  ngOnInit(): void {
    this.initScanner();
  }

  async initScanner() {
    const opts = {
      continuous: true,
      video: this.preview.nativeElement,
      mirror: false,
      captureImage: false,
      backgroundScan: false,
      refractoryPeriod: 5000,
      scanPeriod: 5,
    };

    const scanner = new Instascan.Scanner(opts);

    scanner.addListener('scan', (content: any) => {
      console.log(content);
      // Puedes hacer lo que quieras con el contenido del escaneo aquí

      // Redirige a '/YapeoCamera' usando la ruta de Angular
      // Reemplaza esto con tu lógica de redirección específica de Angular
      // this.router.navigate(['/YapeoCamera']);
    });

    Instascan.Camera.getCameras().then((cameras: string | any[]) => {
      if (cameras.length > 0) {
        scanner.start(cameras[cameras.length - 1]);
      } else {
        console.error('No se encontraron cámaras.');
      }
    }).catch((e: any) => {
      console.error(e);
    });
  }
}