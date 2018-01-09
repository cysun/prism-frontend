import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from '../models/user.model';

interface UserResponse {
  token: string;
}

@Injectable()
export class AuthService {
  public token: string;
  private TOKEN = 'jwt_token';
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<UserResponse> {
    const credentials = JSON.stringify({'username': username, 'password': password });
    console.log('my credentials are: ' + credentials);

    return this.http.post<UserResponse>('/api/login', credentials, this.HEADERS);

    // return this.http.post('/api/login', credentials, this.HEADERS).subscribe(
    //   // res => { console.log('Token: ' + JSON.stringify(res)); },
    //   err => { console.log('Error has occurred.'); }
    // )
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem(this.TOKEN)) {
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
  }

}
