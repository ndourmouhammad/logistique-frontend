import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationExpeditionGuichet } from './creation-expedition-guichet';

describe('CreationExpeditionGuichet', () => {
  let component: CreationExpeditionGuichet;
  let fixture: ComponentFixture<CreationExpeditionGuichet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationExpeditionGuichet],
    }).compileComponents();

    fixture = TestBed.createComponent(CreationExpeditionGuichet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
