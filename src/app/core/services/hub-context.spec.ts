import { TestBed } from '@angular/core/testing';

import { HubContext } from './hub-context';

describe('HubContext', () => {
  let service: HubContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
