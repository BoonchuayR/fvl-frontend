import { TestBed } from '@angular/core/testing';

import { TopupService } from './topup.service';

describe('TopupService', () => {
  let service: TopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
