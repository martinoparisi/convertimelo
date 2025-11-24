import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextManipulator } from './text-manipulator';

describe('TextManipulator', () => {
  let component: TextManipulator;
  let fixture: ComponentFixture<TextManipulator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextManipulator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextManipulator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
