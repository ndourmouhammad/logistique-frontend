import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRelais } from './stock-relais';

describe('StockRelais', () => {
  let component: StockRelais;
  let fixture: ComponentFixture<StockRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(StockRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
