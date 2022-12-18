import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperLeftLogoComponent } from './upper-left-logo.component';

describe('UpperLeftLogoComponent', () => {
  let component: UpperLeftLogoComponent;
  let fixture: ComponentFixture<UpperLeftLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpperLeftLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpperLeftLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
