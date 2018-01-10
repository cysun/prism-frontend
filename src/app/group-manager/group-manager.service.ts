import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

@Injectable()
export class GroupManagerService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('/api/groups');
  }

  getUsers(): Observable<User> {
    return this.http.get<User>('/api/users');
  }

  getGroup(id): Observable<Group> {
    return this.http.get<Group>('/api/group/' + id);
  }

  addGroup(group: Group): Observable<Group> {
    const body = JSON.stringify({'_id': group._id, 'name': group.name, 'members': group.members});
    return this.http.post<Group>('/api/group', body, this.HEADERS);
  }

  updateGroup(group: Group): Observable<Group> {
    const body = JSON.stringify({'name': group.name});
    return this.http.patch<Group>('/api/group/' + group._id, body, this.HEADERS);
  }

  deleteGroup(id): Observable<Group> {
    return this.http.delete<Group>('/api/group/' + id, this.HEADERS);
  }

  addMember(userId, groupId): Observable<Group> {
    return this.http.put<Group>('/api/group/' + groupId + '/member/' + userId, this.HEADERS);
  }

  deleteMember(groupId, memberId): Observable<Group> {
      return this.http.delete<Group>('/api/group/' + groupId + '/member/' + memberId, this.HEADERS);
  }
}
