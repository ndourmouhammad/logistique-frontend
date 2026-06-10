import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemiseGuichet } from './remise-guichet';

describe('RemiseGuichet', () => {
  let component: RemiseGuichet;
  let fixture: ComponentFixture<RemiseGuichet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemiseGuichet],
    }).compileComponents();

    fixture = TestBed.createComponent(RemiseGuichet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
