import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargadoComponent } from './recargado.component';

describe('RecargadoComponent', () => {
  let component: RecargadoComponent;
  let fixture: ComponentFixture<RecargadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecargadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
