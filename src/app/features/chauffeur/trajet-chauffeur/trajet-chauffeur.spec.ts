import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetChauffeur } from './trajet-chauffeur';

describe('TrajetChauffeur', () => {
  let component: TrajetChauffeur;
  let fixture: ComponentFixture<TrajetChauffeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetChauffeur],
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetChauffeur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
