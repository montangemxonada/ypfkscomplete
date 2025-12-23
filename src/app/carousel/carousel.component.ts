import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() items: any[] = [];
  currentIndex = 0;
  offset = '0vw';
  isDragging = false;
  private startX = 0;
  private currentTranslate = 0;
  private interval: any;
  private animationId: any;

  @ViewChild('track', { static: true }) track!: ElementRef;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    cancelAnimationFrame(this.animationId);
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      if (!this.isDragging) {
        this.nextSlide();
      }
    }, 4000);
  }

  stopAutoSlide() {
    clearInterval(this.interval);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updatePosition();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.updatePosition();
    this.restartAutoSlide();
  }

  updatePosition() {
    this.offset = `calc(-${this.currentIndex * 81}vw)`;
    this.currentTranslate = -this.currentIndex * 81;
    this.track.nativeElement.style.transition = 'transform 0.5s ease';
  }

  restartAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // Lógica de arrastre corregida
  startDrag(event: MouseEvent | TouchEvent, isTouch = false) {
    this.isDragging = true;
    this.stopAutoSlide();
    this.startX = isTouch ? 
      (event as TouchEvent).touches[0].clientX : 
      (event as MouseEvent).clientX;
    this.track.nativeElement.style.transition = 'none';
  }

  onDrag(event: MouseEvent | TouchEvent, isTouch = false) {
    if (!this.isDragging) return;
    event.preventDefault();
    
    const currentX = isTouch ? 
      (event as TouchEvent).touches[0].clientX : 
      (event as MouseEvent).clientX;
    
    const diff = currentX - this.startX;
    const newTranslate = this.currentTranslate + (diff / window.innerWidth * 100);
    
    this.offset = `${newTranslate}vw`;
    this.animationId = requestAnimationFrame(() => this.onDrag(event, isTouch));
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    cancelAnimationFrame(this.animationId);
    
    const track = this.track.nativeElement;
    track.style.transition = 'transform 0.5s ease';
    
    // Línea corregida - cálculo de diffPercent
    const diffPercent = (parseFloat(this.offset.replace('vw', '')) - this.currentTranslate);
    const threshold = 15;
    
    if (diffPercent > threshold && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (diffPercent < -threshold && this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    }
    
    this.updatePosition();
    this.restartAutoSlide();
  }
}

  // @Input() items: any[] = [];
  // extendedItems: any[] = [];
  // realIndex = 0; // Índice real (0 a items.length - 1)
  // offset = '0vw';
  // isDragging = false;
  // private startX = 0;
  // private currentTranslate = 0;
  // private interval: any;
  // private animationId: any;
  // private readonly itemsToClone = 3; // Cuántos elementos duplicar

  // @ViewChild('track', { static: true }) track!: ElementRef;

  // ngOnInit() {
  //   this.prepareItems();
  //   this.startAutoSlide();
  //   // Posicionamos en el "centro" virtual
  //   setTimeout(() => {
  //     this.goToSlide(0);
  //   }, 100);
  // }

  // ngOnDestroy() {
  //   this.stopAutoSlide();
  //   cancelAnimationFrame(this.animationId);
  // }

  // prepareItems() {
  //   // Duplicamos elementos para efecto infinito
  //   this.extendedItems = [
  //     ...this.items.slice(-this.itemsToClone), // últimos elementos al inicio
  //     ...this.items,
  //     ...this.items.slice(0, this.itemsToClone) // primeros elementos al final
  //   ];
  // }

  // startAutoSlide() {
  //   this.interval = setInterval(() => {
  //     if (!this.isDragging) {
  //       this.nextSlide();
  //     }
  //   }, 4000);
  // }

  // stopAutoSlide() {
  //   clearInterval(this.interval);
  // }

  // nextSlide() {
  //   this.realIndex = (this.realIndex + 1) % this.items.length;
  //   this.updatePosition();
  // }

  // goToSlide(index: number) {
  //   this.realIndex = index;
  //   this.updatePosition();
  //   this.restartAutoSlide();
  // }

  // updatePosition() {
  //   // Calculamos la posición en el track extendido
  //   const virtualIndex = this.realIndex + this.itemsToClone;
  //   this.currentTranslate = -virtualIndex * 81;
  //   this.offset = `${this.currentTranslate}vw`;
  //   this.track.nativeElement.style.transition = 'transform 0.5s ease';
  // }

  // restartAutoSlide() {
  //   this.stopAutoSlide();
  //   this.startAutoSlide();
  // }

  // // Lógica de arrastre (similar a la versión anterior)
  // startDrag(event: MouseEvent | TouchEvent, isTouch = false) {
  //   this.isDragging = true;
  //   this.stopAutoSlide();
  //   this.startX = isTouch ? 
  //     (event as TouchEvent).touches[0].clientX : 
  //     (event as MouseEvent).clientX;
  //   this.track.nativeElement.style.transition = 'none';
  // }

  // onDrag(event: MouseEvent | TouchEvent, isTouch = false) {
  //   if (!this.isDragging) return;
  //   event.preventDefault();
    
  //   const currentX = isTouch ? 
  //     (event as TouchEvent).touches[0].clientX : 
  //     (event as MouseEvent).clientX;
    
  //   const diff = currentX - this.startX;
  //   const newTranslate = this.currentTranslate + (diff / window.innerWidth * 100);
    
  //   this.offset = `${newTranslate}vw`;
  //   this.animationId = requestAnimationFrame(() => this.onDrag(event, isTouch));
  // }

  // endDrag() {
  //   if (!this.isDragging) return;
  //   this.isDragging = false;
  //   cancelAnimationFrame(this.animationId);
    
  //   const track = this.track.nativeElement;
  //   track.style.transition = 'transform 0.5s ease';
    
  //   // Calculamos el índice real basado en la posición
  //   const itemWidth = 81; // 75vw + 6vw margin
  //   const scrollPos = -parseFloat(this.offset.replace('vw', ''));
  //   const virtualIndex = Math.round(scrollPos / itemWidth);
    
  //   // Ajustamos para el efecto infinito
  //   if (virtualIndex < this.itemsToClone) {
  //     // Si estamos en los clones iniciales, saltamos al final real
  //     this.realIndex = this.items.length - (this.itemsToClone - virtualIndex);
  //   } else if (virtualIndex >= this.items.length + this.itemsToClone) {
  //     // Si estamos en los clones finales, saltamos al inicio real
  //     this.realIndex = virtualIndex - (this.items.length + this.itemsToClone);
  //   } else {
  //     // Posición normal
  //     this.realIndex = virtualIndex - this.itemsToClone;
  //   }
    
  //   this.updatePosition();
  //   this.restartAutoSlide();
  // }
  //}