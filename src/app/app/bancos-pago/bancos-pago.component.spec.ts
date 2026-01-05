import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancosPagoComponent } from './bancos-pago.component';

describe('BancosPagoComponent', () => {
  let component: BancosPagoComponent;
  let fixture: ComponentFixture<BancosPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BancosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
