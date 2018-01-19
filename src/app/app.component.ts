import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/components/common/api';

import { AuthService } from './login/auth.service';

@Component({
  selector: 'prism-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  userMenuItems: MenuItem[];
  username: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.username = currentUser.username;

    this.userMenuItems = [
      { label: 'Settings', icon: 'fa-gear'},
      { label: 'Logout',
        icon: 'fa-sign-out',
        command: (event: any) => {
          this.authService.logout();
          this.router.navigate(['login'])
        }
      },
    ];
  }
}
