import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilChauffeur } from './profil-chauffeur';

describe('ProfilChauffeur', () => {
  let component: ProfilChauffeur;
  let fixture: ComponentFixture<ProfilChauffeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilChauffeur],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilChauffeur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
