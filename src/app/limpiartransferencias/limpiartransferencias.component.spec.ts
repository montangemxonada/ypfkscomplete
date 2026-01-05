import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimpiartransferenciasComponent } from './limpiartransferencias.component';

describe('LimpiartransferenciasComponent', () => {
  let component: LimpiartransferenciasComponent;
  let fixture: ComponentFixture<LimpiartransferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimpiartransferenciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LimpiartransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
