import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from '../models/user.model';
import { UserResponse } from '../models/user-response.model';

@Injectable()
export class AuthService {
  public token: string;
  private TOKEN = 'jwt_token';
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<UserResponse> {
    const credentials = JSON.stringify({'username': username, 'password': password });
    return this.http.post<UserResponse>('/api/login', credentials, this.HEADERS);
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem(this.TOKEN)) {
      console.log('Is authenticated and here is the token: ' + localStorage.getItem(this.TOKEN));
      return true;
    }
    console.log('Is not authenticated');
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem('currentUser');
  }

}
