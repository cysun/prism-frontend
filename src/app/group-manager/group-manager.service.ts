import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import {Group} from '../models/group.model';

@Injectable()
export class GroupManagerService {

  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('/api/groups');
  }

  addGroup(group: Group): Observable<Group> {
    const body = JSON.stringify({'name': group.name, 'members': group.members});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

    return this.http.post<Group>('/api/group', body, header);
  }

}
