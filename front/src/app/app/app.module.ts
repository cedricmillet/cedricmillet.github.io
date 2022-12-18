import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { Viewer3dModule } from '../viewer-3d/viewer-3d.module';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    /** Angular built in */
    BrowserModule,
    /** Feature Modules */
    Viewer3dModule,
    /** Core module */
    CoreModule
    /** Shared module */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
