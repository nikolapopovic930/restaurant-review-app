import { Component, Input, OnInit } from '@angular/core';
import { RestaurantModel } from '../restaurant.model';
import { AlertController, ModalController } from '@ionic/angular';
import { RestaurantsService } from '../restaurants.service';
import { RestaurantModalComponent } from '../restaurant-modal/restaurant-modal.component';

@Component({
  selector: 'app-restaurant-element',
  templateUrl: './restaurant-element.component.html',
  styleUrls: ['./restaurant-element.component.scss'],
})
export class RestaurantElementComponent  implements OnInit {

  @Input() restaurant: RestaurantModel

  constructor(private alertCtrl: AlertController, private restaurantsService: RestaurantsService, private modalCtrl: ModalController) { }

  ngOnInit() {null}

  

  onDeleteRestaurant() {
    this.alertCtrl.create({
      header: "Deleting restaurant",
      message: "Are you sure you want to delete restaurant?",
      buttons: [
        {
          text: "Delete",
          handler: () => {
            this.restaurantsService.deleteRestaurant(this.restaurant.id).subscribe(() => {
            console.log("Delete it!");
            });
          } 

        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Dont delete it!");
          }

        } 
      ]
      
    }).then( (alert: HTMLIonAlertElement) => {
      alert.present();
    })
  }


  async onEditRestaurant() {
    const modal = await this.modalCtrl.create({
      component: RestaurantModalComponent,
      componentProps: {
        
        title: 'Edit restaurant', 
        name: this.restaurant.name, 
        address: this.restaurant.address, 
        city: this.restaurant.city, 
        grade: this.restaurant.grade, 
        text: this.restaurant.text, 
        mode: 'edit'}
      
    });

    modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.restaurantsService
        .editRestaurant(
          this.restaurant.id,
          data.restaurantData.name,
          data.restaurantData.address,
          data.restaurantData.city,
          data.restaurantData.grade,
          this.restaurant.imageUrl,
          data.restaurantData.text,
          this.restaurant.userId
          
          )
        .subscribe((res) => {
          this.restaurant.name = data.restaurantData.name;
          this.restaurant.address = data.restaurantData.address;
          this.restaurant.city = data.restaurantData.city;
          this.restaurant.grade = +data.restaurantData.grade;
          this.restaurant.text = data.restaurantData.text;
        });
    }
  }

}
