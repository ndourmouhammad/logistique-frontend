import { TestBed } from '@angular/core/testing';

import { Expedition } from './expedition';

describe('Expedition', () => {
  let service: Expedition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Expedition);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
