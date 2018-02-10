import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      this.username = this.authService.getUser().username;
    }
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.router.navigate(['login'])
  }
}
