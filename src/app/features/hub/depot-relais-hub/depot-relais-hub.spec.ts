import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotRelaisHub } from './depot-relais-hub';

describe('DepotRelaisHub', () => {
  let component: DepotRelaisHub;
  let fixture: ComponentFixture<DepotRelaisHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotRelaisHub],
    }).compileComponents();

    fixture = TestBed.createComponent(DepotRelaisHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
