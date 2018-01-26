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

  getGroup(id): Observable<Group> {
    return this.http.get<Group>('/api/group/' + id);
  }

  addGroup(group: Group): Observable<Group> {
    const body = JSON.stringify({'_id': group._id, 'name': group.name, 'members': group.members});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

    return this.http.post<Group>('/api/group', body, header);
  }

  updateGroup(group: Group): Observable<Group> {
    const body = JSON.stringify({'name': group.name});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

    return this.http.patch<Group>('/api/group/' + group._id, body, header);
  }

  deleteGroup(id): Observable<Group> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<Group>('/api/group/' + id, header);
  }

  addMember(userId, groupId): Observable<Group> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.put<Group>('/api/group/' + groupId + '/member/' + userId, header);
  }

  deleteMember(groupId, memberId): Observable<Group> {
      const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
      return this.http.delete<Group>('/api/group/' + groupId + '/member/' + memberId, header);
  }
}
