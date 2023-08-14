import { TestBed } from '@angular/core/testing';

import { NgxCurrencyMaskService } from './ngx-currency-mask.service';

describe('NgxCurrencyMaskService', () => {
  let service: NgxCurrencyMaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCurrencyMaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
