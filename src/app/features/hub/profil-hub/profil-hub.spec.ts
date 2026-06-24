import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilHub } from './profil-hub';

describe('ProfilHub', () => {
  let component: ProfilHub;
  let fixture: ComponentFixture<ProfilHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilHub],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
