import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionYapeComponent } from './notificacion-yape.component';

describe('NotificacionYapeComponent', () => {
  let component: NotificacionYapeComponent;
  let fixture: ComponentFixture<NotificacionYapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionYapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificacionYapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
