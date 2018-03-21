import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../login/auth.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'prism-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  username: string;

  constructor(private sharedService: SharedService,
    private authService: AuthService,
     private router: Router) { }

  ngOnInit() {
    const user = this.authService.getUser();
    this.username = user.user.username;
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.router.navigate(['login']);
  }
}
