import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from '../models/user.model';

@Injectable()
export class SettingsService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  getUser(userId): Observable<User> {
    return this.http.get<User>('/api/user/' + userId);
  }

  updateBasicInfo(user: User): Observable<User> {
    const body = JSON.stringify({
      'name': {
        'first': user.name.first,
        'last': user.name.last
      },
      'email': user.email
    })
    return this.http.patch<User>('/api/user/' + user._id, body, this.HEADERS);
  }

  changePassword(userId: string, newPassword: string): Observable<User> {
    const body = JSON.stringify({'password' : newPassword});
    return this.http.patch<User>('/api/user/' + userId, body, this.HEADERS);
  }
}
