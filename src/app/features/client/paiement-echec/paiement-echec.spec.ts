import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementEchec } from './paiement-echec';

describe('PaiementEchec', () => {
  let component: PaiementEchec;
  let fixture: ComponentFixture<PaiementEchec>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementEchec],
    }).compileComponents();

    fixture = TestBed.createComponent(PaiementEchec);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
