import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontoComponent } from './monto.component';

describe('MontoComponent', () => {
  let component: MontoComponent;
  let fixture: ComponentFixture<MontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
