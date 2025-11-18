import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ImageConverterComponent } from './components/image-converter/image-converter.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';
import { UnitConverterComponent } from './components/unit-converter/unit-converter.component';
import { TextUtilsComponent } from './components/text-utils/text-utils.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageConverterComponent,
    CurrencyConverterComponent,
    UnitConverterComponent,
    TextUtilsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
