import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanHub } from './plan-hub';

describe('PlanHub', () => {
  let component: PlanHub;
  let fixture: ComponentFixture<PlanHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanHub],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
