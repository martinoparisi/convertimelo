import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertitoreUnitaComponent } from './convertitore-unita.component';

describe('ConvertitoreUnitaComponent', () => {
  let component: ConvertitoreUnitaComponent;
  let fixture: ComponentFixture<ConvertitoreUnitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertitoreUnitaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvertitoreUnitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
