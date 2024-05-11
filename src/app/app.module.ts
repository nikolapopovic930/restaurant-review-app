import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';




@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, provideFirebaseApp(() => initializeApp({"projectId":"restaurant-review-app-47636","appId":"1:1013832181727:web:c593d546b476582b6dc66a","databaseURL":"https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"restaurant-review-app-47636.appspot.com","apiKey":"AIzaSyAnY5o8YuQZBV1NiJ45Itr-eG2S1DLcrUk","authDomain":"restaurant-review-app-47636.firebaseapp.com","messagingSenderId":"1013832181727"})), provideStorage(() => getStorage())],
  providers: [
  Geolocation,
  Storage,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
