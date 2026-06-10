import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHub } from './dashboard-hub';

describe('DashboardHub', () => {
  let component: DashboardHub;
  let fixture: ComponentFixture<DashboardHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHub],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
