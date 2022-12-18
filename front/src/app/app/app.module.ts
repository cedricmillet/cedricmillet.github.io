import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { Viewer3dModule } from '../viewer-3d/viewer-3d.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    Viewer3dModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
