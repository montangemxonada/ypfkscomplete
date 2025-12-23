import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecmontoComponent } from './recmonto.component';

describe('RecmontoComponent', () => {
  let component: RecmontoComponent;
  let fixture: ComponentFixture<RecmontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecmontoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecmontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
