import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRelais } from './dashboard-relais';

describe('DashboardRelais', () => {
  let component: DashboardRelais;
  let fixture: ComponentFixture<DashboardRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
