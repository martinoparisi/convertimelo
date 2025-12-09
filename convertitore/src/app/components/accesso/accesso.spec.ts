import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoComponent } from './accesso.component';

describe('AccessoComponent', () => {
  let component: AccessoComponent;
  let fixture: ComponentFixture<AccessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
