import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicestgComponent } from './servicestg.component';

describe('ServicestgComponent', () => {
  let component: ServicestgComponent;
  let fixture: ComponentFixture<ServicestgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicestgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicestgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
