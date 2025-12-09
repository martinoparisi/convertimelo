import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertitoreValutaComponent } from './convertitore-valuta.component';

describe('ConvertitoreValutaComponent', () => {
  let component: ConvertitoreValutaComponent;
  let fixture: ComponentFixture<ConvertitoreValutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertitoreValutaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvertitoreValutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
