import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { RestaurantModel } from './restaurant.model';
import { RestaurantsService } from './restaurants.service';
import { ModalController } from '@ionic/angular';
import { RestaurantModalComponent } from './restaurant-modal/restaurant-modal.component';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit, OnDestroy {


restaurants!: RestaurantModel[];
private restaurantSub!: Subscription;
userid:string;

  constructor(private restaurantsService: RestaurantsService, private modalCtrl: ModalController, private authService: AuthService) {


   }



  ngOnInit() {
     this.restaurantSub = this.restaurantsService.restaurants.subscribe((restaurants) => {  
       this.restaurants = restaurants;

     });

     this.authService
            .userId
           .subscribe((userId) => {
             this.userid = userId;
             console.log(this.userid);
           });
  }

  ionViewWillEnter(){
    this.restaurantsService.getRestaurantsByUserId(this.userid).subscribe((restaurants) => {  
    });
  }


  onAddRestaurant(){
    this.modalCtrl.create({
      component: RestaurantModalComponent,
      componentProps: {title: 'Add restaurant'}
    })
    .then((modal :HTMLIonModalElement) => {
      modal.present();
      return modal.onDidDismiss();
    })
    .then((resultData) => {
      if(resultData.role === 'confirm') {
        console.log(resultData);
        this.restaurantsService.addRestaurant(
          resultData.data.restaurantData.name, 
          resultData.data.restaurantData.address, 
          resultData.data.restaurantData.city,
          +resultData.data.restaurantData.grade, 
          resultData.data.restaurantData.text,
          resultData.data.restaurantData.imageUrl
        ).subscribe((restaurants) => {
        
        });
      }
    });
  }
  
  ngOnDestroy() {
    if(this.restaurantSub) {
      this.restaurantSub.unsubscribe();
    }
  }
  
  
  

}
