import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilLivreur } from './profil-livreur';

describe('ProfilLivreur', () => {
  let component: ProfilLivreur;
  let fixture: ComponentFixture<ProfilLivreur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilLivreur],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilLivreur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
