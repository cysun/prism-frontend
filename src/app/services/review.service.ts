import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Review } from '../models/review.model';
import { Program } from '../models/program.model';

@Injectable()
export class ReviewService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  getReview(id: string): Observable<Review> {
    return this.http.get<Review>(`/api/review/${id}`);
  }

  patchReview(id: string, changes): Observable<Review> {
    return this.http.patch<Review>(`/api/review/${id}`, changes);
  }

  deleteReview(id: string) {
    return this.http.delete<Review>(`/api/review/${id}`);
  }

  restoreReview(id: string) {
    return this.http.post<Review>(`/api/review/${id}/restore`, '');
  }

  createReview(program: Program, startDate: Date): Observable<Review> {
    return this.http.post<Review>('/api/review', {
      'program': program._id,
      'title': program.name + ' ' + startDate.getFullYear(),
      'startDate': startDate
    });
  }

  finalizeNode(reviewId: string, nodeId: string) {
    return this.http.post(`/api/review/${reviewId}/node/${nodeId}/finalize`, '');
  }

  setNodeFinishDate(reviewId: string, nodeId: string, finishDate: string) {
    return this.http.patch(`/api/review/${reviewId}/node/${nodeId}`, {
      'finishDate': finishDate
    });
  }

  createNode(id: string, title: string, groups: string[], completionEstimate: number) {
    return this.http.post(`/api/review/${id}/node`, {
      'title': title,
      'groups': groups,
      'completionEstimate': completionEstimate
    }, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }

  createNodeFromTemplate(id: string, templateId: string) {
    return this.http.post(`/api/review/${id}/node`, {
      'template': templateId
    }, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>('/api/reviews');
  }
}
