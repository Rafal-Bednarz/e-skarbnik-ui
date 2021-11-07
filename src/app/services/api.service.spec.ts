import { TestBed } from '@angular/core/testing';

import { UrlService } from './url.service';

describe('ApiService', () => {
  let service: UrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
