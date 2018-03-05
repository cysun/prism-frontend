import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user.model';
import { UserResponse } from '../models/user-response.model';

@Injectable()
export class AuthService {
  public token: string;
  private TOKEN = 'jwt_token';
  private usernameSource = new BehaviorSubject('');
  currentUsername = this.usernameSource.asObservable();

  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<UserResponse> {
    const credentials = JSON.stringify({'username': username, 'password': password });
    return this.http.post<UserResponse>('/api/login', credentials, this.HEADERS);
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem(this.TOKEN) && localStorage.getItem('currentUser')) {
      // console.log('Is authenticated and here is the token: ' + localStorage.getItem(this.TOKEN));
      // console.log('Is authenticated and here is the user info: ' + localStorage.getItem('currentUser'));
      return true;
    }
    console.log('Is not authenticated');
    return false;
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return user;
  }

  sendUsername(username: string) {
    this.usernameSource.next(username);
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem('currentUser');
  }

}
