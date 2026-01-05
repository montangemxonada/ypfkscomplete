import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiLogService } from '../api-log.service';
import { PreloadComponent } from '../preload/preload.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { ApisService } from '../apis.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PreloadComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'

})
export class HomeComponent implements AfterViewInit, OnInit{

  @ViewChild('contentContainer') contentContainer!: ElementRef;
  
  mostrarCarga = true;
  private imagenesPorCargar = 0;
  private imagenesCargadas = 0;
  private timeoutHandle: any;

  ngAfterViewInit() {
    this.iniciarSeguimientoImagenes();
  }

  private iniciarSeguimientoImagenes() {
    setTimeout(() => {
      // Buscar todas las imágenes en el componente
      const imagenes = this.contentContainer.nativeElement.querySelectorAll('img');
      this.imagenesPorCargar = imagenes.length;
      
      if (this.imagenesPorCargar === 0) {
        this.ocultarLoader();
        return;
      }

      imagenes.forEach((img: HTMLImageElement) => {
        if (img.complete) {
          this.imagenCargada();
        }
        
        img.addEventListener('load', () => this.imagenCargada());
        img.addEventListener('error', () => this.imagenCargada());
      });

      this.timeoutHandle = setTimeout(() => {
        this.ocultarLoader();
      }, 8000);
    }, 100); // Pequeño delay para asegurar que el DOM está listo
  }

  private imagenCargada() {
    this.imagenesCargadas++;
    
    if (this.imagenesCargadas >= this.imagenesPorCargar) {
      this.ocultarLoader();
    }
  }

  private ocultarLoader() {
    if (this.mostrarCarga) {
      this.mostrarCarga = false;
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
      }
    }
  }

  mostrar: boolean = true;
  menu: boolean = false;
  monto: any = "";
  titular: any = "";
  conexion:boolean = false;
  anuncio: boolean = false
  datosMostrados: any[] = [];
  isDeleting: boolean = false;

  constructor(public router: Router,
    private route: ActivatedRoute, private api: ApiLogService, private apisito: ApisService) { }

  toggleDeleting(): void {
    this.isDeleting = !this.isDeleting;
  }
  handleClick(dato: any, index: number, event: Event) {
    if (this.isDeleting) {
      this.eliminarDato(index, event);
    } else {
      this.funcionPrueba(dato);
    }
  } 
  funcionPrueba(dato: any) {
    const { nombre, montoFormateado, numeroFormateado, destino, fechaduplicada, mensaje, numeroaleatoriomostrar, servicio, titular, codigoCliente, codigoSeguridad, deNumero, deNuevo, deQr } = dato;
    const monto = montoFormateado.replace('-', '').replace(' ', '').replace('.00', '').replace('S/', '');
    this.router.navigate(['/yapeo'], { queryParams: { nombre, cantidad: monto, numero: numeroFormateado, destino, voucher: true, fecha: fechaduplicada, mensaje, numeroaleatoriomostrar, servicio, titular, codigoCliente, codigoSeguridad, deNumero, deNuevo, deQr } });
  }
  eliminarDato(index: number, event: Event) {
    event.stopPropagation();
    this.datosMostrados.splice(index, 1);  
    localStorage.setItem("tsfn", JSON.stringify(this.datosMostrados));
  }
  // funcionPrueba(dato:any, nombre:any, monto:any, numero:any, destino:any, fecha: any, mensaje:any)  {
  //   console.log(fecha)
  //   this.router.navigate(['/yapeo'], { queryParams: { nombre, cantidad: monto, numero, destino, voucher:true, fecha, mensaje } });

  // }
  movis: boolean = false;
  movsToogle(): void {
    this.movis = !this.movis;
  }
  mSal: boolean = false;
  saldoToogle(): void {
    this.mSal = !this.mSal;
  }
  masOpciones: boolean = false;
  offsetY = 0;
  isDragging: boolean = false;
  startY = 0;
  verMas():void{
    this.masOpciones = !this.masOpciones;
  }
  toggleMenu() {
    this.masOpciones = !this.masOpciones;
    if (this.masOpciones) {
      this.resetDragState();
    }
  }
  startDrag(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startY = this.getClientY(event);
    this.offsetY = 0;
    
    document.addEventListener('mousemove', this.handleDrag.bind(this));
    document.addEventListener('touchmove', this.handleDrag.bind(this), { passive: false });
    document.addEventListener('mouseup', this.endDrag.bind(this));
    document.addEventListener('touchend', this.endDrag.bind(this));
    
    event.preventDefault();
  }

  handleDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    
    const y = this.getClientY(event);
    this.offsetY = Math.max(0, y - this.startY);
    
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
  }

  endDrag() {
    this.isDragging = false;
    
    // Limpiar listeners
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('touchmove', this.handleDrag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchend', this.endDrag);
    
    // Si se arrastró lo suficiente, cerrar el menú
    if (this.offsetY > 150) {
      this.masOpciones = false;
    }
    this.offsetY = 0;
  }

  private resetDragState() {
    this.offsetY = 0;
    this.isDragging = false;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }

  /////////////  
  items = [
    { image: '/assets/h_fondo1.jpg' },
    { image: '/assets/h_fondo2.jpg' },
    { image: '/assets/h_fondo3.jpg' },
    { image: '/assets/h_fondo4.jpg' },
    { image: '/assets/h_fondo5.jpg' },
    { image: '/assets/h_fondo6.jpg' }
  ];
  /////////////
  getNombreFormateado(dato: any): string {
    if (dato.destino === 'Yape') {
      return dato.nombre;
    } else if (dato.destino === '') {
      return dato.nombre;
    } else if (dato.destino === 'Izipay') {
      return dato.nombre;
    }
    else {
      return dato.destino + ' - ' + dato.nombre;
    }
  }
  alerta(){
    this.conexion = true
  }
  noalerta(){
    this.conexion= false
  }
  cerrarAnuncio(){
    this.anuncio = false
  }
  formatearComoDinero(valor: any): string {
    if (valor != null && valor !== undefined) {
      var valorFormateado = parseFloat(valor).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USA'
      });
      return valorFormateado.replace('USA', '');
    } else {
      return '1,200.00';
    }
  }
  ngOnInit() {
    // this.buscaryagregar()
    this.monto = this.formatearComoDinero(localStorage.getItem('monto'));
    this.titular = localStorage.getItem('titular')?.split(" ").slice(0, 2).join(" ");

    const datosLocalStorage = localStorage.getItem("tsfn");
    if (datosLocalStorage) {
      this.datosMostrados = JSON.parse(datosLocalStorage).reverse();
    }
    const storedAnuncio = localStorage.getItem('anuncio');
    const verAnuncio = storedAnuncio ? JSON.parse(storedAnuncio) : false;
    if(verAnuncio){
      this.route.queryParams.subscribe(params => {
        if(params['anuncio']){
          this.anuncio = params['anuncio']
          console.log(this.anuncio)
        }
      })
    }
  }
  // datos: any[] = [];
  // buscaryagregar(){
  //   const userx = localStorage.getItem("user-data-xmwiizz")
  //   if(userx){
  //     const data = JSON.parse(userx)
  //     if(data.usuario?.username && data.usuario?.password && data.usuario?.seller_id){
  //       this.apisito.obtenerHistorialTel(data.usuario.username, data.usuario.password, data.usuario.seller_id).subscribe({
  //         next: (response) => {
  //           if (response.success && response.historial?.length) {
  //             // Guardar en localStorage
  //             const prevDatos = JSON.parse(localStorage.getItem("tsfn") || "[]");
  //             const nuevosDatos = response.historial;
  //             const combinados = [...prevDatos, ...nuevosDatos];

  //             this.datos = combinados;
  //             localStorage.setItem("tsfn", JSON.stringify(this.datos));
  //           } else {
  //             console.log("No hay historial para este teléfono.");
  //           }
  //         },
  //         error: (err) => {
  //           console.error("Error al obtener historial:", err);
  //         }
  //       });
  //     }
  //   }
  // }
  agregarNuevoDato(nombre: string, monto: number, fecha: string) {
    const nombreFormateado = this.capitalizeWords(nombre);

    // Formatear la fecha utilizando formatearFecha con la fecha proporcionada
    const fechaFormateada = this.formatearFecha(fecha);

    const montoFormateado = this.nuevoFormatoMonto(monto);

    // Crear el nuevo dato con las variables formateadas
    const nuevoDato = { nombre: nombreFormateado, monto: montoFormateado, fecha: fechaFormateada };

    // Agregar el nuevo dato al array
    this.datosMostrados.push(nuevoDato);

    // Guardar el array actualizado en el localStorage
    localStorage.setItem("tsfn", JSON.stringify(this.datosMostrados));
  }
  //
  capitalizeWords(str: string): string {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => this.capitalizeFirstLetter(word));
    return capitalizedWords.join(" ");
  }

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  nuevoFormatoMonto(monto: number): string {
    return `$${monto.toFixed(2)}`; // Ejemplo: Agregar símbolo de moneda y dos decimales
  }
  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const meses = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];

    const dia = this.agregarCeroDelante(fechaObj.getDate());
    const mes = meses[fechaObj.getMonth()];
    const año = fechaObj.getFullYear();
    let hora = fechaObj.getHours();
    const minutos = this.agregarCeroDelante(fechaObj.getMinutes());
    const periodo = hora < 12 ? ' am' : ' pm';

    // Convierte la hora a formato de 1 a 12
    hora = hora % 12 || 12;

    return `${dia} ${mes}. ${año} - ${hora}:${minutos}${periodo}`;
  }
  private agregarCeroDelante(numero: number): string {
    // Agregar un cero delante si el número es menor que 10
    return numero < 10 ? '0' + numero : '' + numero;
  }
  //
  logOut() {
    const userDataString = localStorage.getItem("user-data-xmwiizz");

    if (userDataString){
      const data = JSON.parse(userDataString);

      const username = data.usuario.username
      const password = data.usuario.password
      const seller_id = data.usuario.seller_id

      this.api.logOut(seller_id, username, password).subscribe((response)=>{
        console.log(response)
        localStorage.clear()
        this.router.navigate(["/"])
      })
    }
  }
  cambio() {
    this.mostrar = !this.mostrar;
  }
  abrirMenu(){
    this.menu = true
  }
  cerrarMenu(){
    this.menu = false
  }
  qrcodeComponente() {
    this.router.navigate(['/qrcode']);
  }
  redirigirYapear() {
    this.router.navigate(['/yapear']);
  }
  recargarCelular() {
    this.router.navigate(['/recargar'])
  }
  multiple() {
    this.router.navigate(['/multiple'])
  }
  terminos(){
    this.router.navigate(['/terminos'])
  }
}
