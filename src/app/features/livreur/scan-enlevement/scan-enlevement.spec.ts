import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanEnlevement } from './scan-enlevement';

describe('ScanEnlevement', () => {
  let component: ScanEnlevement;
  let fixture: ComponentFixture<ScanEnlevement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanEnlevement],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanEnlevement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
