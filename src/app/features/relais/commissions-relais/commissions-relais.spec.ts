import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsRelais } from './commissions-relais';

describe('CommissionsRelais', () => {
  let component: CommissionsRelais;
  let fixture: ComponentFixture<CommissionsRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionsRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(CommissionsRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
