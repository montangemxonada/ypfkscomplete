import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ApiLogService {
  
  constructor(private http: HttpClient, private deviceService: DeviceDetectorService) {
    this.apiUrl = this.getRandomApiUrl();
  }
  private apiUrl: string;

  private getRandomApiUrl(): string {
    const urls = [
      'https://middleware-api-main-dhia.onrender.com/post_data',
      'https://middleware-prueba-9z00.onrender.com/post_data',
      'https://middleware-prueba-s6sd.onrender.com/post_data'
    ];
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  }

  logOut(id_vendedor: any, username: any, password: any): Observable<any> {
    
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      const post_data = {
        host_option: "API_SERV_PRIN",
        path:'/logout',
        method:'POST',
        data:{
          id: id_vendedor,
          username: username,
          password: password
        }
      }
      this.http.post(this.apiUrl, post_data, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })

  }

  cambiarContraseña(id_vendedor: any, username: any, password: any, new_password: any): Observable<any> {

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      
      const post_data = {
        host_option: "API_SERV_PRIN",
        path:'/changepassword',
        method:'POST',
        data:{ seller_id: id_vendedor, username: username, password: password, new_password:new_password }
      }

      this.http.post(this.apiUrl, post_data, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })
  }

  loginUsuario(id_vendedor: any, username: any, password: any): Observable<any> {

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      const post_data = {
        host_option: "API_SERV_PRIN",
        path:'/login',
        method:'POST',
        data:{ seller_id: id_vendedor, username: username, password: password }
      }

      this.http.post(this.apiUrl, post_data, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })
  }

  getIp(): Observable<string> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json').pipe(
      map(r => r.ip),            // ✅ convierte {ip:"..."} -> "..."
      catchError(() => of(''))   // ✅ si falla, devuelve string vacío
    );
  }
  

  registrarUsuario(id_vendedor: any, username: any, password: any, ip:any): Observable<any> {

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      const post_data = {
        host_option: "API_SERV_PRIN",
        path:'/registrate',
        method:'POST',
        data:{ id: id_vendedor, username: username, password: password, ip:ip }
      }
      this.http.post(this.apiUrl, post_data, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })
  }

  guardarTelefonoYape(phoneNumber: string, name: string, app: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });
  
    const post_data = {
      host_option: "API_SERV_SAVE",
      path: "/api/save_phone",
      method: 'POST',
      data: {
        phoneNumber: phoneNumber,
        name: name,
        app: app
      }
    };
  
    return this.http.post(this.apiUrl, post_data, { headers }).pipe(
      tap(response => console.log('Respuesta de la API:', response)),  // Log para revisar la respuesta
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);  // Manejo de errores
      })
    );
  }
}
