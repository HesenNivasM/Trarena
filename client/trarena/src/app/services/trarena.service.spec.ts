import { TestBed } from '@angular/core/testing';

import { TrarenaService } from './trarena.service';

describe('TrarenaService', () => {
  let service: TrarenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrarenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
