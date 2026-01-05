import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoxComponent } from './dox.component';

describe('DoxComponent', () => {
  let component: DoxComponent;
  let fixture: ComponentFixture<DoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
