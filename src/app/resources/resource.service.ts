import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Resource } from '../models/resource.model';

@Injectable()
export class ResourceService {

  constructor(private http: HttpClient) { }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>('/api/resource/');
  }

  getResource(id): Observable<Resource> {
    return this.http.get<Resource>('/api/resource/' + id);
  }

  addResource(resource: Resource): Observable<Resource> {
    const body = JSON.stringify({'title': resource.title, 'message': resource.message, 'uploader': resource.uploader, 'groups': resource.groups});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.post<Resource>('/api/resource', body, header);
  }

  deleteResource(id): Observable<Resource> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<Resource>('/api/resource/' + id, header);
  }

}
