import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapeoEditadoComponent } from './yapeo-editado.component';

describe('YapeoEditadoComponent', () => {
  let component: YapeoEditadoComponent;
  let fixture: ComponentFixture<YapeoEditadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapeoEditadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YapeoEditadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
