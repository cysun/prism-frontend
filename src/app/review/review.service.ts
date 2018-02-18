import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Review } from '../models/review.model';

@Injectable()
export class ReviewService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  getReview(id): Observable<Review> {
    return this.http.get<Review>('/api/review/' + id);
  }
}
