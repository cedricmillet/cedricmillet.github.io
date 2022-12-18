import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperRightCtaComponent } from './upper-right-cta.component';

describe('UpperRightCtaComponent', () => {
  let component: UpperRightCtaComponent;
  let fixture: ComponentFixture<UpperRightCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpperRightCtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpperRightCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
