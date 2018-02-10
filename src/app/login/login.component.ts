import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { decode as jwtDecode } from 'jsonwebtoken';

import { AuthService } from './auth.service';

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

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe( data => {
      const decoded = JSON.stringify(jwtDecode(data.token));

      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('currentUser', decoded);

      console.log('Group info about User: ' + JSON.stringify(data.groups));

      const decodedParsed = JSON.parse(decoded);
      const date = new Date(parseInt(decodedParsed.iat, 10) * 1000 )

      console.log('converted iat: ' + date)

      this.router.navigate(['dashboard']);
      this.wrongInfo = false;
    }, err => {
      this.password = '';
      this.wrongInfo = true;
    })
  }

}
