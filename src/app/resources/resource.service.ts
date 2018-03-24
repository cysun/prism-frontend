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

  createResource(title: string): Observable<Resource> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    const body = JSON.stringify({'title': title});
    return this.http.post<Resource>('/api/resource', body, header);
  }

  deleteResource(id): Observable<Resource> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<Resource>('/api/resource/' + id, header);
  }

  downloadAllResources() {

  }

  downloadResources(ids) {

  }

  uploadFile(resourceId: string, file: File) {
    const fileUpload = new FormData();
    fileUpload.append('file', file);

    return this.http.post('/api/resource/' + resourceId + '/file',
    fileUpload, { responseType: 'text' });
  }

}
