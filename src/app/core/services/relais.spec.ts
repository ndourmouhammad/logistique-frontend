import { TestBed } from '@angular/core/testing';

import { Relais } from './relais';

describe('Relais', () => {
  let service: Relais;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Relais);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
