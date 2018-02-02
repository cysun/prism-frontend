import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Document } from '../models/document.model';

@Injectable()
export class DocumentService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  createDocument(title: string): Observable<Document> {
    const body = JSON.stringify({ 'title': title });
    return this.http.post<Document>('/api/document', body, this.HEADERS);
  }

  retrieveDocument(documentId: string): Observable<Document> {
    return this.http.get<Document>('/api/document/' + documentId);
  }

}
