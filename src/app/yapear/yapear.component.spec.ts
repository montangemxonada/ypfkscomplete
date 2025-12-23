import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapearComponent } from './yapear.component';

describe('YapearComponent', () => {
  let component: YapearComponent;
  let fixture: ComponentFixture<YapearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YapearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
