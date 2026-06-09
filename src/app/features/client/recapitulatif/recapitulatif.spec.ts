import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recapitulatif } from './recapitulatif';

describe('Recapitulatif', () => {
  let component: Recapitulatif;
  let fixture: ComponentFixture<Recapitulatif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recapitulatif],
    }).compileComponents();

    fixture = TestBed.createComponent(Recapitulatif);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
