import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genkit } from './genkit';

describe('Genkit', () => {
  let component: Genkit;
  let fixture: ComponentFixture<Genkit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genkit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Genkit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
