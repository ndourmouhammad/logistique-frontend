import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartChauffeur } from './depart-chauffeur';

describe('DepartChauffeur', () => {
  let component: DepartChauffeur;
  let fixture: ComponentFixture<DepartChauffeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartChauffeur],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartChauffeur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
