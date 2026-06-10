import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueTournees } from './historique-tournees';

describe('HistoriqueTournees', () => {
  let component: HistoriqueTournees;
  let fixture: ComponentFixture<HistoriqueTournees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueTournees],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriqueTournees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
