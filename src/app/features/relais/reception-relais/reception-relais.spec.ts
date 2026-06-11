import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionRelais } from './reception-relais';

describe('ReceptionRelais', () => {
  let component: ReceptionRelais;
  let fixture: ComponentFixture<ReceptionRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceptionRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
