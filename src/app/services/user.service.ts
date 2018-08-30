import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from '../models/user.model';
@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getUser(id): Observable<User> {
    return this.http.get<User>('/api/user/' + id);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>('/api/user/' + user._id, user);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/user/', user);
  }
}
