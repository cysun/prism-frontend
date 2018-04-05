import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Program } from '../../../models/program.model';

@Injectable()
export class ProgramService {

  constructor(private http: HttpClient) { }

  getProgramsAt(departmentId): Observable<Program[]> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Program[]>('/api/department/' + departmentId + '/programs', header);
  }

  getProgram(programId): Observable<Program> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Program>('/api/program/' + programId, header);
  }

  addProgram(program: Program, nextReviewDate): Observable<Program> {
    const date = nextReviewDate.year + '-' + (nextReviewDate.month === 12 ? 1 : nextReviewDate.month + 1)  + '-' + nextReviewDate.day;
    const body = JSON.stringify({'_id': program._id, 'name': program.name, 'department': program.department, 'nextReviewDate': date});
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.post<Program>('/api/program', body, header);
  }

  deleteProgram(programId): Observable<Program> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.delete<Program>('/api/program/' + programId, header);
  }

  updateProgram(program: Program): Observable<Program> {
    const body = JSON.stringify({
      '_id': program._id,
      'name': program.name,
      'department': program.department,
      'nextReviewDate': program.nextReviewDate
    });
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.patch<Program>('/api/program/' + program._id, body, header);
  }

  getPrograms(): Observable<Program[]> {
    const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.http.get<Program[]>('/api/programs', header);
  }

}
