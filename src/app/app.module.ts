import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { JsonViewerComponent } from './components/json-viewer/json-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    JsonViewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [JsonViewerComponent]
})
export class AppModule { }
