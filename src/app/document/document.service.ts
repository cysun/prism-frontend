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

  /* Post a new revision */
  postRevision(documentId: string, message: string): Observable<Document> {
    const body = JSON.stringify({'message': message});
    return this.http.post<Document>('/api/document/' + documentId + '/revision', body, this.HEADERS);
  }

  /* Delete a revision */
  deleteRevision(documentId: string, revisionIndex: string): Observable<Document> {
    return this.http.delete<Document>('/api/document/' + documentId + '/revision/' + revisionIndex, this.HEADERS);
  }

  /* Upload a file */
  uploadFile(documentId: string, revisionIndex: string, file: File): Observable<Document> {
    const fileUpload = new FormData();
    fileUpload.append('file', file);

    return this.http.post<Document>('/api/document/' + documentId + '/revision/' + revisionIndex + '/file',
      fileUpload);
  }

  /* Download a file */
  downloadFile(documentId: string, revisionIndex: Number): Observable<File> {
    return this.http.get<File>('/api/document/' + documentId + '/revision/' + revisionIndex + '/file');
  }
}
