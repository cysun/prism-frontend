import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { College } from '../models/college.model';

@Injectable()
export class CollegesService {

  constructor(private http: HttpClient) { }

  getColleges(): Observable<College[]> {
    return this.http.get<College[]>('/api/colleges');
  }

  getCollege(id): Observable<College> {
    return this.http.get<College>('/api/college/' + id);
  }

  addCollege(college: College): Observable<College> {
    const body = JSON.stringify({'_id': college._id, 'name': college.name, 'abbreviation': college.abbreviation, 'deans': college.deans});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.post<College>('api/college', body, header);
  }

  updateCollege(college: College): Observable<College> {
    const body = JSON.stringify({'name': college.name});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.patch<College>('/api/college/' + college._id, body, header);
  }

  deleteCollege(id): Observable<College> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<College>('api/college/' + id, header);
  }

  addDean(deanId, collegeId): Observable<College> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.put<College>('/api/college/' + collegeId + '/dean/' + deanId, header);
  }

  deleteDean(deanId, collegeId): Observable<College> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<College>('/api/college/' + collegeId + '/dean/' + deanId, header);
  }

}
