import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantsPageRoutingModule } from './restaurants-routing.module';

import { RestaurantsPage } from './restaurants.page';
import { RestaurantElementComponent } from './restaurant-element/restaurant-element.component';
import { RestaurantModalComponent } from './restaurant-modal/restaurant-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantsPageRoutingModule
  ],
  declarations: [RestaurantsPage, RestaurantElementComponent, RestaurantModalComponent]
  
})
export class RestaurantsPageModule {}
