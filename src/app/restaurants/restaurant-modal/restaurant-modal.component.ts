import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';


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
  @Input() imageUrl: string;
  
  image:any;
  imageFormat: any;
  
  constructor(private modalCtrl: ModalController, private geoLocation: Geolocation, private storage: Storage) { }

  ngOnInit() {
  null
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

async onSubmit(){
    if(!this.form.valid) {
      return;
    }

    if(this.image != null){
    const blob = this.dataURLtoBlob(this.image);
    const url = await this.uploadImage(blob, this.imageFormat);
    this.imageUrl = url;
    console.log(url);
    }
    
    if(this.imageUrl == null) {
      this.imageUrl = "https://firebasestorage.googleapis.com/v0/b/restaurant-review-app-47636.appspot.com/o/test%2F1715425759378.png?alt=media&token=84cb5630-06e1-4926-b2c1-e37631006066"
    }

    this.modalCtrl.dismiss({
      restaurantData: 
        {
          name: this.form.value['name'], 
          address: this.form.value['address'], 
          city: this.form.value['city'],
          grade: +this.form.value['grade'], 
          text: this.form.value['text'],
          imageUrl: this.imageUrl
        }
      }, 'confirm');

      
  }

  isValidGrade(val: number): boolean { return (val>5 || val<1) && val != null; }


///////////


async fillUserAddressWithUserCurrentPosition() {
  try {
    const resp = await this.geoLocation.getCurrentPosition();
    const latitude = resp.coords.latitude;
    const longitude = resp.coords.longitude;

    const apiKey = 'AIzaSyDX9dHcyILb2zEVAI8l_ziOkSWTXB1AoO0';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&key=${apiKey}`;

    const response = await axios.get(url);
    const results = response.data.results;

    if (results && results.length > 0) {
      let address = '';
      let city = '';
      let streetNumber = '';

      for (const component of results[0].address_components) {
        if (component.types.includes('route')) {
          address = component.long_name;
        } else if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('street_number')) {
          streetNumber = component.long_name;
        }
      }

      const fullAddress = streetNumber ? `${address} ${streetNumber}` : address;

      console.log('User Address:', fullAddress);
      console.log('City:', city);

     
      this.address = fullAddress;
      this.city = city;
    } else {
      console.error('No address found');
     
    }
  } catch (error) {
    console.error('Error getting user location:', error);
    
  }
}

/////////////


async takePicture() {
  try {
    if(Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      width: 600,
      resultType: CameraResultType.DataUrl
    });
    console.log('image: ', image);
    this.image = image.dataUrl;
    this.imageFormat = image.format;
    return this.image;
    
  } catch(e) {
    console.log(e);
  }
}

dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

async uploadImage(blob: any, imageFormat: any) {
  const currentDate = Date.now();
  const filePath = `test/${currentDate}.${imageFormat}`;
  const fileRef = ref(this.storage, filePath);
  const task = await uploadBytes(fileRef, blob);
  console.log('task:', task);
  const url = getDownloadURL(fileRef);
  return url;
} catch(e) {
  throw(e);
}



}

