import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { ApisService } from '../apis.service';
import { Router } from '@angular/router';
import jsQR from 'jsqr';
import { CommonModule } from '@angular/common';
import { ApiLogService } from '../api-log.service';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements AfterViewInit {
  @ViewChild('Preview', { static: false }) preview!: ElementRef;
  public qrCodeResult: string | null = null;
  errrqr: boolean = false;
  constructor(private api: ApisService, private router: Router, private apiLogs: ApiLogService) { }
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngAfterViewInit(): void {
    if (this.preview && this.preview.nativeElement) {
      this.initScanner();
    } else {
      console.error('El elemento preview o su nativeElement es undefined.');
    }
  }
  deQr: boolean = false;
  async initScanner() {
    const videoElement = this.preview.nativeElement;

    const codeReader = new BrowserMultiFormatReader();
    let isListening = false;

    try {
      const devices = await codeReader.getVideoInputDevices();
      if (!this.selectedDeviceId) {
        for (const device of devices) {
          if (device.label.includes('back') || device.label.includes('rear')) {
            this.selectedDeviceId = device.deviceId;
            break;
          }
        }
        if (!this.selectedDeviceId && devices.length > 0) {
          this.selectedDeviceId = devices[0].deviceId;
        }
      }

      console.log("DEVICE: " + this.selectedDeviceId)

      codeReader.decodeFromVideoDevice(this.selectedDeviceId, videoElement, (result, error) => {

        if (result) {
          isListening = false;
          codeReader.stopContinuousDecode();
          const userDataString = localStorage.getItem("user-data-xmwiizz");
          if (userDataString) {
            const data = JSON.parse(userDataString);

            const username = data.usuario.username
            const password = data.usuario.password
            const seller_id = data.usuario.seller_id

            this.api.consultarInformacionQrPlin(result.getText(), username, password, seller_id).subscribe(
              (response: any) => {
                let nombre = ""
                let destino = ""
                let numero = ""
                if(response.datos.destino && response.datos.titular){
                  nombre = response.datos.titular
                  destino = response.datos.destino
                  console.log(response)
                  if(response.datos.numero){
                    numero = response.datos.numero
                    
                  } 
                } else {
                  this.errrqr = true
                }
                const deQr = true
                this.router.navigate(['/monto'], { queryParams: { deQr, nombre, numero, destino } });
              },
              (error: any) => {
                if (error.status === 422) {
                  console.log('Respuesta de error 422:', error.error);
                } else {
                  this.errrqr = true
                }
                this.errrqr = true
              }
            );
          }



        }
        if (error && !(error instanceof NotFoundException)) {
          console.error('Error al escanear:', error);
        }

      });
    } catch (error) {
      this.errrqr = true
    }
  }

  private selectedDeviceId: string | null = null;

  changeCameraPosition(): void {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.stopContinuousDecode();

    codeReader.getVideoInputDevices().then(devices => {
      const currentIndex = devices.findIndex(device => device.deviceId === this.selectedDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;

      this.selectedDeviceId = devices[nextIndex].deviceId;

      this.initScanner();
    });
  }

  homeComponente() {
    this.router.navigate(['/home']);
  }
  //
  onFileSelected(event: any): void {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              this.processQRCodeResult(code.data);
            } else {
              console.error('No QR code found in the image.');
            }
          } else {
            console.error('Could not get 2D context from canvas.');
          }
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  processQRCodeResult(qrCodeResult: string): void {
    const userDataString = localStorage.getItem("user-data-xmwiizz");
    if (userDataString) {
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id

      this.api.consultarInformacionQrPlin(qrCodeResult, username, password, seller_id).subscribe(
        (response: any) => {
          let nombre = ""
          let destino = ""
          let numero = ""
          if(response.datos.destino && response.datos.titular){
            nombre = response.datos.titular
            destino = response.datos.destino
            console.log(response)
            if(response.datos.numero){
              numero = response.datos.numero
              
            } 
          } else {
            this.errrqr = true
          }
          const deQr = true
          this.router.navigate(['/monto'], { queryParams: { deQr, nombre, numero, destino } });
        },
        (error: any) => {
          if (error.status === 422) {
            console.log('Respuesta de error 422:', error.error);
          } else {
            this.errrqr = true
          }
          this.errrqr = true
        }
      );
    }
  }

  openFileInput(): void {
    // Simula el clic en el elemento de entrada de tipo archivo
    this.fileInput.nativeElement.click();
  }
}