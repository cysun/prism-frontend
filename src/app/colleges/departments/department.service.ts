import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from '../../models/user.model';
import { Department } from '../../models/department.model';

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDepartmentsAt(collegeId): Observable<Department[]> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Department[]>('/api/college/' + collegeId + '/departments', header);
  }

  getDepartment(departmentId): Observable<Department> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Department>('/api/department/' + departmentId, header);
  }

  addDepartment(department: Department): Observable<Department> {
    const body = JSON.stringify({'name': department.name, 'abbreviation': department.abbreviation, 'college': department.college});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.post<Department>('/api/department', body, header);
  }

  deleteDepartment(departmentId): Observable<Department> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<Department>('/api/department/' + departmentId, header);
  }

  updateDepartment(department: Department): Observable<Department> {
    const body = JSON.stringify({'_id': department._id, 'name': department.name,
      'abbreviation': department.abbreviation, 'college': department.college,
      'chairs': department.chairs});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.patch<Department>('/api/department/' + department._id, body, header);
  }

  getDepartments(): Observable<Department[]> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Department[]>('/api/departments', header)
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

}
