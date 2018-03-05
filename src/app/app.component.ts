import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { AuthService } from './login/auth.service';

@Component({
  selector: 'prism-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  username: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      /* Initially get the username upon login into the system */
      this.authService.currentUsername.subscribe( data => {
        this.username = data;
      })

      /* After any browser refresh, retrieve the current username */
      if (this.username.length <= 0) {
        this.username = this.authService.getUser().username;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.router.navigate(['login'])
  }
}
