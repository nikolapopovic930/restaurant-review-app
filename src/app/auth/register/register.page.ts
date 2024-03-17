import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;



  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname:new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)])
    });
  }


  onRegister() {
    this.loadingCtrl.create({ message: "Registering..." }).then((loadingEl) => {
      loadingEl.present();

      this.authService.register(this.registerForm.value).subscribe(
        resData => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/restaurants');
        },
        error => {
          loadingEl.dismiss();
          this.presentAlert('Registration Failed', 'Please fill all fields.');
        }
      );
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}