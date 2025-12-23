import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccesoBancosPagoApiService {

  constructor(private http: HttpClient, private deviceService: DeviceDetectorService) { }

  logOut(id_vendedor: any, username: any, password: any): Observable<any> {
    const url = 'http://173.208.138.94:8080/logout'
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      this.http.post(url, { id: id_vendedor, username: username, password: password }, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })

  }

  loginUsuario(id_vendedor: any, username: any, password: any): Observable<any> {
    const url = 'http://173.208.138.94:8080/login';

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      this.http.post(url, { seller_id: id_vendedor, username: username, password: password }, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })
  }

  registrarUsuario(id_vendedor: any, username: any, password: any): Observable<any> {
    const url = 'http://173.208.138.94:8080/registrate';

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return new Observable(observer => {
      this.http.post(url, { id: id_vendedor, username: username, password: password }, { headers }).subscribe((response) => {
        observer.next(response);
        observer.complete();
      })
    })
  }


}
