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

}
