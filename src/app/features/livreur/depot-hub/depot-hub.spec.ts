import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotHub } from './depot-hub';

describe('DepotHub', () => {
  let component: DepotHub;
  let fixture: ComponentFixture<DepotHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotHub],
    }).compileComponents();

    fixture = TestBed.createComponent(DepotHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
