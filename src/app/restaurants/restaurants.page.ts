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

//  restaurants: RestaurantModel[] = [
//    {id: 'r1', ime: 'breza', adresa: 'dunavski kej 11', ocena: '4', imageUrl:'https://getsling.com/wp-content/uploads/2019/11/Types-Of-Restaurants_A.png', komentar:'lep' },
//    {id: 'r2', ime: 'lipa', adresa: 'cara dusana 5', ocena: '1', imageUrl:'https://getsling.com/wp-content/uploads/2019/11/Types-Of-Restaurants_A.png', komentar:'dobar' }
//  ]

restaurants!: RestaurantModel[];
private restaurantSub!: Subscription;
userid:string;

  constructor(private restaurantsService: RestaurantsService, private modalCtrl: ModalController, private authService: AuthService) {

    //this.restaurants = this.restaurantsService.restaurants;

   }

// pitati

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
    //  this.restaurants = restaurants;
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
          resultData.data.restaurantData.text
        ).subscribe((restaurants) => {
        //  this.restaurants = restaurants;
        
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
