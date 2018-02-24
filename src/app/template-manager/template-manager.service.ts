import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Document } from '../models/document.model';

@Injectable()
export class TemplateManagerService {
  constructor(private http: HttpClient) { }

  /* List all the current templates */
  listAllTemplates(): Observable<Document[]> {
    return this.http.get<Document[]>('/api/templates');
  }

  /* Create a template */
  createTemplate(templateTitle: string, templateEstimate: number): Observable<Document> {
    const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'title': templateTitle, 'completionEstimate': templateEstimate });

    return this.http.post<Document>('/api/template', body, headers);
  }

  /* Delete a template */
  deleteTemplate(templateId: string) {
    return this.http.delete('/api/template/' + templateId);
  }
}
