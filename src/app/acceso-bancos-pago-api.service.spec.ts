import { TestBed } from '@angular/core/testing';

import { AccesoBancosPagoApiService } from './acceso-bancos-pago-api.service';

describe('AccesoBancosPagoApiService', () => {
  let service: AccesoBancosPagoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesoBancosPagoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
