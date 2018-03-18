import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { ActionLogger } from '../models/action-logger.model';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getRootActionLogs(pageNumber: number): Observable<ActionLogger[]> {
    return this.http.get<ActionLogger[]>('/api/actions?page=' + pageNumber);
  }

  getUserActionLogs(userId: string, pageNumber: number): Observable<ActionLogger[]> {
    return this.http.get<ActionLogger[]>('/api/actions?user=' + userId + '&page=' + pageNumber);
  }

  getNumberOfUserLogs(userId?: string): Observable<any> {
    if (userId) {
      return this.http.get<any>('/api/actions?user=' + userId + '&count=1');
    }
    return this.http.get<any>('/api/actions?count=1');
  }
}
