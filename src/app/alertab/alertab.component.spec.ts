import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertabComponent } from './alertab.component';

describe('AlertabComponent', () => {
  let component: AlertabComponent;
  let fixture: ComponentFixture<AlertabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
