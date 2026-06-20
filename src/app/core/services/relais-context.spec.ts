import { TestBed } from '@angular/core/testing';

import { RelaisContext } from './relais-context';

describe('RelaisContext', () => {
  let service: RelaisContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelaisContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
