import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  email:string;

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit() {
 
    this.authService
           .userEmail
           .subscribe((email) => {
             this.email = email;
             console.log(this.email);
           });
  }

  onLogOut() {
    this.authService.logout();
    this.router.navigateByUrl('/log-in');
  }



}
