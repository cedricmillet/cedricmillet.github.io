import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperLeftLogoComponent } from './components/upper-left-logo/upper-left-logo.component';
import { UpperRightCtaComponent } from './components/upper-right-cta/upper-right-cta.component';
import { UpperMiddleNavbarComponent } from './components/upper-middle-navbar/upper-middle-navbar.component';
import { HeaderContainerComponent } from './containers/header-container/header-container.component';
import { FooterContainerComponent } from './containers/footer-container/footer-container.component';



@NgModule({
  declarations: [
    UpperLeftLogoComponent,
    UpperRightCtaComponent,
    UpperMiddleNavbarComponent,
    HeaderContainerComponent,
    FooterContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderContainerComponent,
    FooterContainerComponent
  ]
})
export class CoreModule { }
