import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Document } from '../models/document.model';
import { ExternalUpload } from '../models/external-upload.model';
import { User } from '../models/user.model';

@Injectable()
export class DocumentService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  /* Create a document */
  createDocument(title: string): Observable<Document> {
    const body = JSON.stringify({ 'title': title });
    return this.http.post<Document>(`/api/document`, body, this.HEADERS);
  }

  /* Gets the document based on ID */
  retrieveDocument(documentId: string): Observable<Document> {
    return this.http.get<Document>(`/api/document/${documentId}`);
  }

  /* Edit a document's title */
  editDocument(documentId: string, newDocumentTitle: string): Observable<Document> {
    const body = JSON.stringify({ 'title': newDocumentTitle });
    return this.http.patch<Document>(`/api/document/${documentId}`, body, this.HEADERS);
  }

  /* Post a new revision */
  postRevision(documentId: string, message: string) {
    const body = JSON.stringify({'message': message});

    return this.http.post(`/api/document/${documentId}/revision`, body, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }

  /* Delete a revision */
  deleteRevision(documentId: string, revisionIndex: number) {
    return this.http.delete(`/api/document/${documentId}/revision/${revisionIndex}`);
  }

  /* Upload a file */
  uploadFile(documentId: string, revisionIndex: number, file: File) {
    const fileUpload = new FormData();
    fileUpload.append('file', file);

    return this.http.post(`/api/document/${documentId}/revision/${revisionIndex}/file`,
    fileUpload, { responseType: 'text' });
  }

  /* Download a file */
  downloadFile(documentId: string, revisionIndex: number) {
    return this.http.get(`/api/document/${documentId}/revision/${revisionIndex}/file`,
    { responseType: 'blob', observe: 'response'});
  }

  /* Revert to a revision */
  revertRevision(documentId: string, revisionIndex: number) {
    const body = JSON.stringify({ 'revert': revisionIndex });
    return this.http.post(`/api/document/${documentId}/revision`, body, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }

  /* Restore revision */
  restoreRevision(documentId: string, revisionIndex: number) {
    return this.http.post(`/api/document/${documentId}/revision/${revisionIndex}/restore`,
      null, { responseType: 'text' });
  }

  /* Add comment */
  addComment(documentId: string, comment: string, revisionIndex: number, fileName: string) {
    const body = JSON.stringify({'text': comment, 'revision': revisionIndex, 'originalFilename': fileName });
    return this.http.post(`/api/document/${documentId}/comment`, body, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }

  /* Edit comment */
  editComment(documentId: string, commentIndex: number, comment: string) {
    const body = JSON.stringify({'text': comment });
    return this.http.patch(`api/document/${documentId}/comment/${commentIndex}`, body, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }

  /* Delete comment */
  deleteComment(documentId: string, commentIndex: number) {
    return this.http.delete(`/api/document/${documentId}/comment/${commentIndex}`,
      { responseType: 'text' });
  }

  /* Subscribe to a document */
  subscribeToDocument(documentId: string) {
    return this.http.post(`/api/document/${documentId}/subscribe`, null);
  }

  /* Unsubscribe to a document */
  unsubscribeFromDocument(documentId: string) {
    return this.http.post(`/api/document/${documentId}/unsubscribe`, null);
  }

  /* Create an external account for external reviewer */
  createExternalUpload(documentId: string, externalReviewer: User, externalMessage: string):
    Observable<ExternalUpload> {
    return this.http.post<ExternalUpload>(`/api/document/${documentId}/external-upload`,
      { user: externalReviewer, message: externalMessage }, this.HEADERS);
  }
}
