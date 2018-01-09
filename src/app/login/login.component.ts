import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import * as jwtDecode from 'jwt-decode';

@Component({
  selector: 'prism-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  wrongInfo: Boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { }

  login() {
    this.authService.login(this.username, this.password).subscribe( data => {
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('currentUser', jwtDecode(data.token));

      console.log('the token is: ' + data.token);
      console.log('here is the token decoded: ' + JSON.stringify(jwtDecode(data.token)));

      this.wrongInfo = false;
      this.router.navigate(['dashboard']);

    }, err => {
      this.password = '';
      this.wrongInfo = true;
    })
  }

}
