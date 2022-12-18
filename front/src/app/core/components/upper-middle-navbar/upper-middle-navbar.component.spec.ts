import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperMiddleNavbarComponent } from './upper-middle-navbar.component';

describe('UpperMiddleNavbarComponent', () => {
  let component: UpperMiddleNavbarComponent;
  let fixture: ComponentFixture<UpperMiddleNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpperMiddleNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpperMiddleNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
