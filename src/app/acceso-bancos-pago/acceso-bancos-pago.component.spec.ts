import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoBancosPagoComponent } from './acceso-bancos-pago.component';

describe('AccesoBancosPagoComponent', () => {
  let component: AccesoBancosPagoComponent;
  let fixture: ComponentFixture<AccesoBancosPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoBancosPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccesoBancosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
