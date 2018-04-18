import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { ExternalUpload } from '../models/external-upload.model';

@Injectable()
export class ExternalUploadService {

  constructor(private http: HttpClient) { }

  /* Get external upload */
  getExternalUpload(token: string): Observable<ExternalUpload> {
    return this.http.get<ExternalUpload>(`/api/external-upload/${token}`);
  }

  /* Upload a file from external reviewer */
  uploadExternalDocument(token: string, file: File) {
    const fileUpload = new FormData();
    fileUpload.append('file', file);

    return this.http.post(`/api/external-upload/${token}`, fileUpload,
      { responseType: 'text' });
  }

}
