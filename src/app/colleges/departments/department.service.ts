import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Department } from '../../models/department.model';

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDepartments(collegeId): Observable<Department[]>{
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Department[]>('/api/college/' + collegeId + '/departments', header);
  }

  addDepartments(department: Department): Observable<Department>{
    const body = JSON.stringify({'_id': department._id, 'name': department.name, 'abbreviation': department.abbreviation, 'college': department.college, 'chairs': department.chairs });
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

    return this.http.post<Department>('api/department', body, header);
  }
}
