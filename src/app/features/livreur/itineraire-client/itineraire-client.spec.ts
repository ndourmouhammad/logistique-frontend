import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraireClient } from './itineraire-client';

describe('ItineraireClient', () => {
  let component: ItineraireClient;
  let fixture: ComponentFixture<ItineraireClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraireClient],
    }).compileComponents();

    fixture = TestBed.createComponent(ItineraireClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
