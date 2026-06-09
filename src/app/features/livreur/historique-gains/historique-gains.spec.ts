import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueGains } from './historique-gains';

describe('HistoriqueGains', () => {
  let component: HistoriqueGains;
  let fixture: ComponentFixture<HistoriqueGains>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueGains],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriqueGains);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
