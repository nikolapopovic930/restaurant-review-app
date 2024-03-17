import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
//import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

@Component({
  selector: 'app-restaurant-modal',
  templateUrl: './restaurant-modal.component.html',
  styleUrls: ['./restaurant-modal.component.scss'],
})
export class RestaurantModalComponent  implements OnInit {
  @ViewChild("f", {static: true}) form!: NgForm;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() title!: string;
  @Input() name: string;
  @Input() address: string;
  @Input() city: string;
  @Input() grade: number;
  @Input() text: string;

  //
  // options: NativeGeocoderOptions = {
  //   useLocale: true,
  //   maxResults: 5
  // }
  // geoAddress: any;
  //

  //constructor(private modalCtrl: ModalController, private nativegeocoder: NativeGeocoder) { }
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {null
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onSubmit(){
    if(!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss({
      restaurantData: 
        {
          name: this.form.value['name'], 
          address: this.form.value['address'], 
          city: this.form.value['city'],
          grade: +this.form.value['grade'], 
          text: this.form.value['text']
        }
      }, 'confirm');

  }

  isValidGrade(val: number): boolean { return (val>5 || val<1) && val != null; }



////
// async fetchLocation() {
//     const location = await Geolocation.getCurrentPosition()
//     console.log('location = ', location);
// }


// async fetchLocation() {
//     const location = await Geolocation.getCurrentPosition()
//       console.log('location = ', location);

//       this.nativegeocoder.reverseGeocode(location.coords.latitude, location.coords.longitude, this.options).then((
//         result: NativeGeocoderResult[]) => {

//           console.log('result =', result);
//           console.log('result 0 =', result[0]);

//           this.geoAddress = this.generateAdress(result[0]);

//           console.log('location address = ', this.geoAddress)
//         })
// }
    
  
// generateAdress(addressObj){
//   let obj = [];
//   let uniqueNames = [];
//   let address = "";
//   for (let key in addressObj) {
    
//     if(key!='areasOfIntrest'){
//       obj.push(addressObj[key]);
//     }
//   }

//   var i=0;
//   obj.forEach(value=> {

//     if(uniqueNames.indexOf(obj[i]) === -1){
//       uniqueNames.push(obj[i]);
//     }
//     i++;
//   })

//   uniqueNames.reverse();
//   for (let val in uniqueNames) {
//     if(uniqueNames[val].length)
//     address += uniqueNames[val]+', '
//   }

//   return address.slice(0, -2);
// }


currentLocation: string;
async fetchLocation() {
  try {
    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    const { latitude, longitude } = coordinates.coords;
    this.currentLocation = await this.getAddressFromCoordinates(latitude, longitude);
    console.log(this.currentLocation);
  } catch (error) {
    console.error('Error getting location or address:', error);
  }
}

async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Unknown';
  }
}

}
