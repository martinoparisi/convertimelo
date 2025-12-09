import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManipolatoreTestoComponent } from './manipolatore-testo.component';

describe('ManipolatoreTestoComponent', () => {
  let component: ManipolatoreTestoComponent;
  let fixture: ComponentFixture<ManipolatoreTestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManipolatoreTestoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManipolatoreTestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
