import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Event } from '../models/event.model';

@Injectable()
export class CalendarService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`/api/events`);
  }

  getEvent(eventId: string): Observable<Event> {
    return this.http.get<Event>(`api/event/${eventId}`);
  }

  addEvent(title: string, date: Date): Observable<Event> {
    const body = { 'title': title, 'date': date };
    return this.http.post<Event>(`/api/event`, body, this.HEADERS);
  }

  updateEvent(eventId: string, title: string, date: Date): Observable<Event> {
    const body = { 'title': title, 'date': date };
    return this.http.patch<Event>(`/api/event/${eventId}`, body, this.HEADERS);
  }

  deleteEvent(eventId) {
    return this.http.delete(`/api/event/${eventId}`);
  }
}
