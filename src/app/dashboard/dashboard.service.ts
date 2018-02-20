import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { ActionLogger } from '../models/action-logger.model';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getRootActionLogs(): Observable<ActionLogger[]> {
    return this.http.get<ActionLogger[]>('/api/actions');
  }

}
