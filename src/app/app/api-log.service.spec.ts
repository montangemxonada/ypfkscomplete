import { TestBed } from '@angular/core/testing';

import { ApiLogService } from './api-log.service';

describe('ApiLogService', () => {
  let service: ApiLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
