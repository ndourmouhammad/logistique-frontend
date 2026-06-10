import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionColis } from './reception-colis';

describe('ReceptionColis', () => {
  let component: ReceptionColis;
  let fixture: ComponentFixture<ReceptionColis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionColis],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceptionColis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
