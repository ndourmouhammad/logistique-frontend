import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanLot } from './scan-lot';

describe('ScanLot', () => {
  let component: ScanLot;
  let fixture: ComponentFixture<ScanLot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanLot],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanLot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
