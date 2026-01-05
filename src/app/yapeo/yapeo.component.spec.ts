import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapeoComponent } from './yapeo.component';

describe('YapeoComponent', () => {
  let component: YapeoComponent;
  let fixture: ComponentFixture<YapeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapeoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YapeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
