import { Component, OnInit } from '@angular/core';
import { RestaurantModel } from '../restaurant.model';
import { ActivatedRoute } from '@angular/router';
import { RestaurantsService } from '../restaurants.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.page.html',
  styleUrls: ['./restaurant-details.page.scss'],
})
export class RestaurantDetailsPage implements OnInit {

  restaurant: RestaurantModel = <RestaurantModel>{};


  constructor(private route: ActivatedRoute, private restaurantsService: RestaurantsService,  private navCtrl: NavController) {

   }

   ngOnInit() {
    this.route.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('restaurantId')) {
          this.navCtrl.navigateBack('/restaurants');
          return;
        }
        
         this.restaurantsService
           .getRestaurant(paramMap.get('restaurantId'))
           .subscribe((restaurant) => {
             this.restaurant = restaurant;
             console.log(this.restaurant);
           });
      }
    )
  }

}
