import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCourse } from './nouvelle-course';

describe('NouvelleCourse', () => {
  let component: NouvelleCourse;
  let fixture: ComponentFixture<NouvelleCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouvelleCourse],
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelleCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
