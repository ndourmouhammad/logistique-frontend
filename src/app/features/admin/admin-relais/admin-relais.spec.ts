import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRelais } from './admin-relais';

describe('AdminRelais', () => {
  let component: AdminRelais;
  let fixture: ComponentFixture<AdminRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
