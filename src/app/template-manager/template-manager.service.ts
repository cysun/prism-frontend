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
  createTemplate(
    templateTitle: string,
    templateEstimate: number,
    groups: string[],
    downloadGroups: string[]
  ): Observable<Document> {
    return this.http.post<Document>('/api/template', {
      'title': templateTitle,
      'completionEstimate': templateEstimate,
      'groups': groups,
      'downloadGroups': downloadGroups
    });
  }

  /* Delete a template */
  deleteTemplate(templateId: string) {
    return this.http.delete('/api/template/' + templateId);
  }
}
