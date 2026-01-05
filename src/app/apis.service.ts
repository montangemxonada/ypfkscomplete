import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  // private apiUrl = 'https://middleware-prueba-hhj3.onrender.com/post_data';

  constructor(private http: HttpClient) { 
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
  consultarInformacionYape(phoneNumber: string, username: string, password: string, seller_id: number): Observable<any> {
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/get_yape_new/${phoneNumber}`,
      data: {
        seller_id: seller_id,
        username: username,
        password: password
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );

  }
  consultarInformacionBancos(phoneNumber: string, brand: string, username: string, password: string, seller_id: number): Observable<any> {
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/get_otros_new/${phoneNumber}/${brand}`,
      data: {
        seller_id: seller_id,
        username: username,
        password: password
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );

  }
  senmdSms(username:string, password:string, seller_id:number, numero:string, message:string): Observable<any> {
    
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/send_sms_new",
      data: {
        username,
        password,
        seller_id,
        numero,
        message
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );
  }
  aumentarYapeos(username:string, password:string, seller_id:number, nombre: string, destino: string, cantidad: string, fecha: string): Observable<any> {
    
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/aumentar_yapeos",
      data: {
        username,
        password,
        seller_id,
        nombre,
        destino,
        cantidad,
        fecha
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );
  }
  guardarTelCuenta(username:string, password:string, seller_id:number, tel: string): Observable<any> {
    
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/guardar_tel",
      data: {
        username,
        password,
        seller_id,
        tel,
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );
  }
  verificarYAgregar(username:string, password:string, seller_id:number, numero: string, nuevoDato: any): Observable<any> {
    
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/verificar_y_agregar",
      data: {
        username,
        password,
        seller_id,
        numero,
        nuevoDato
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );
  }
  obtenerHistorialTel(username:string, password:string, seller_id:number): Observable<any> {
    
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/obtener_historial_tel",
      data: {
        username,
        password,
        seller_id
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );
  }

  consultarBancos(seller_id: any, phoneNumber: string, username: string, password: string, code: string): Observable<any> {

    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/getnumber`,
      data: {
        seller_id,
        username,
        password,
        type: code,
        number: phoneNumber
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );
  }

  consultarBancosNew(seller_id: any, phoneNumber: string, username: string, password: string): Observable<any> {

    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/get_bancos_new/${phoneNumber}`,
      data: {
        seller_id,
        username,
        password,
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );
  }

  consultarInformacionPlin(phoneNumber: string, username: string, password: string, seller_id: number): Observable<any> {
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/get_plin/${phoneNumber}`,
      data: {
        seller_id: seller_id,
        username: username,
        password: password
      }
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );

  }

  consultarInformacionQrPlin(qr: string, username: string, password: string, seller_id: number): Observable<any> {

    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/get_qr",
      data: {
        seller_id: seller_id,
        username: username,
        password: password,
        qr: qr
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );

  }

  sendMail(
      username: string, 
      password: string, 
      seller_id: number, 
      email: string, 
      nombre: string, 
      numero: string, 
      operacion: string, 
      fecha: string, 
      user_number: string, 
      monto: string, 
      usuario: string) {
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: "/sendMail",
      data: {
        password,
        seller_id,
        username,
        usuario,
        monto,
        user_number,
        fecha,
        operacion,
        numero,
        nombre,
        email
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
      timeout(40000)
    );

  }
  
  sendRegister(
    username: string, 
    password: string, 
    seller_id: number, 
    nombre: string, 
    monto: string, ) {
  const post_data = {
    host_option: "API_SERV",
    method: "POST",
    path: "/sendRegister",
    data: {
      password,
      seller_id,
      username,
      monto,
      nombre,
    }
  }
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post(this.apiUrl, post_data, { headers: headers }).pipe(
    timeout(40000)
  );

}
  guardarTelefonoYape(phoneNumber: string, name: string, app: string): Observable<any> {
    const data = {
      host_option: "API_SERV_SAVE",
      path: "/api/save_phone",
      method: "POST",
      data: {
        number: phoneNumber,
        name: name,
        app: app
      }
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // console.log('Sending data:', data); // Log data being sent

    return this.http.post(this.apiUrl, data, { headers: headers }).pipe(
      timeout(60000)
    );
  }

  guardarQRYape(qr: string, phoneNumber: string, name: string, app: string): Observable<any> {

    const data = {
      host_option: "API_SERV_SAVE",
      path: "/api/save_qr",
      method: "POST",
      data: { 
        qr: qr, 
        number: phoneNumber, 
        name: name, 
        app: app 
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // console.log('Sending data:', data); // Log data being sent

    return this.http.post(this.apiUrl, data, { headers: headers }).pipe(
      timeout(60000)
    );
  }

  registrarTokenAuto(token_auto: string, username: string, password: string, seller_id: number): Observable<any> {
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/registrar_token_auto/${token_auto}`,
      data: {
        seller_id: seller_id,
        username: username,
        password: password
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );
  }

  registrarTokenSms(token_sms: string, username: string, password: string, seller_id: number): Observable<any> {
    const post_data = {
      host_option: "API_SERV",
      method: "POST",
      path: `/registrar_token_sms/${token_sms}`,
      data: {
        seller_id: seller_id,
        username: username,
        password: password
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, post_data, { headers: headers })
      .pipe(
        timeout(40000)
      );

  }

    verificarTokens(id_vendedor: any, username: any, password: any): Observable<any> {

      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      });

      return new Observable(observer => {
        const post_data = {
          host_option: "API_SERV",
          method: "POST",
          path: `/verificar_token_new`,
          data: { seller_id: id_vendedor, username: username, password: password  }
        }
        this.http.post(this.apiUrl, post_data, { headers }).subscribe((response) => {
          observer.next(response);
          observer.complete();
        })
      })
    }
}


