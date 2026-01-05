import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-limpiartransferencias',
  standalone: true,
  imports: [],
  templateUrl: './limpiartransferencias.component.html',
  styleUrl: './limpiartransferencias.component.scss'
})
export class LimpiartransferenciasComponent {
  constructor(private router: Router){
    localStorage.removeItem("tsfn")
    this.router.navigate(["/"])
  }
}
