import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { ActionLogger } from '../models/action-logger.model';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getRootActionLogs(pageNumber: number): Observable<ActionLogger[]> {
    return this.http.get<ActionLogger[]>('/api/actions?page=' + pageNumber);
  }

  getNumberOfActions(): Observable<any> {
    return this.http.get<any>('/api/actions?count=1');
  }

}
