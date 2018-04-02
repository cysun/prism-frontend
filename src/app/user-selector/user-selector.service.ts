import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

@Injectable()
export class UserSelectorService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getPrsUsers(): Observable<Group> {
    return this.http.get<Group>('api/prs');
  }

}
