import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { ImageConverterComponent } from './components/image-converter/image-converter.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';
import { UnitConverterComponent } from './components/unit-converter/unit-converter.component';
import { TextUtilsComponent } from './components/text-utils/text-utils.component';
import { environment } from '../environments/environment';

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
    FormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
