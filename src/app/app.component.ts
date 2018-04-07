import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { AuthService } from './login/auth.service';
import { SharedService } from './shared/shared.service';
import { UserResponse } from './models/user-response.model';

@Component({
  selector: 'prism-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  username: string;
  isCollapsed = false;
  isAdmin: boolean;

  constructor(private authService: AuthService,
    private sharedService: SharedService,
    private router: Router) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      /* Initially get the username upon login into the system */
      this.authService.currentUsername.subscribe( data => {
        this.username = data;
      })

      /* After any browser refresh, retrieve the current username */
      if (this.username.length <= 0) {
        const user = this.authService.getUser();
        this.username = user.user.username;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.router.navigate(['login'])
  }
}
