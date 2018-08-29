import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { decode as jwtDecode } from 'jsonwebtoken';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'prism-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username: string;
  password: string;
  wrongInfo = false;
  timeout = false;

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
      localStorage.setItem('currentUser', JSON.stringify(data));

      this.authService.sendUsername(data.user.username);

      const decodedParsed = JSON.parse(decoded);
      const date = new Date(parseInt(decodedParsed.iat, 10) * 1000 )

      this.router.navigate(['dashboard']);
      this.wrongInfo = false;
      this.timeout = false
    }, err => {
      if (err.status === 504) {
        this.timeout = true;
        return;
      }
      this.timeout = false;
      this.password = '';
      this.wrongInfo = true;
    })
  }

}
