import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrContactoComponent } from './qr-contacto.component';

describe('QrContactoComponent', () => {
  let component: QrContactoComponent;
  let fixture: ComponentFixture<QrContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrContactoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
