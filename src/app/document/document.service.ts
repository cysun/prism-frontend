import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Document } from '../models/document.model';

@Injectable()
export class DocumentService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  /* Create a document */
  createDocument(title: string): Observable<Document> {
    const body = JSON.stringify({ 'title': title });
    return this.http.post<Document>('/api/document', body, this.HEADERS);
  }

  /* Gets the document based on ID */
  retrieveDocument(documentId: string): Observable<Document> {
    return this.http.get<Document>('/api/document/' + documentId);
  }

  /* Edit a document's title */
  editDocument(documentId: string, document: Document): Observable<Document> {
    const body = JSON.stringify({ 'title': document.title });
    return this.http.patch<Document>('/api/document/' + documentId, body, this.HEADERS);
  }

}
