import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertyComponent } from './alerty.component';

describe('AlertyComponent', () => {
  let component: AlertyComponent;
  let fixture: ComponentFixture<AlertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
