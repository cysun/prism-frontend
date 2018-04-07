import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Event } from '../models/event.model';
import { Document } from '../models/document.model';

@Injectable()
export class CalendarService {
  private HEADERS = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`/api/events`);
  }

  getEvent(eventId: string): Observable<Event> {
    return this.http.get<Event>(`/api/event/${eventId}`);
  }

  addEvent(title: string, date: Date): Observable<Event> {
    const body = { 'title': title, 'date': date };
    return this.http.post<Event>(`/api/event`, body, this.HEADERS);
  }

  attachDocumentToEvent(eventId: string, title: string): Observable<Document> {
    return this.http.post<Document>(`/api/${eventId}/document`, { title : title },
      this.HEADERS);
  }

  removeDocumentFromEvent(eventId: string, documentIndex: number) {
    return this.http.delete(`/api/${eventId}/document/${documentIndex}`);
  }

  updateEvent(eventId: string, changes): Observable<Event> {
    return this.http.patch<Event>(`/api/event/${eventId}`, changes, this.HEADERS);
  }

  cancelEvent(eventId: string) {
    return this.http.post(`/api/event/${eventId}/cancel`, null,
      { responseType: 'text' });
  }

  deleteEvent(eventId) {
    return this.http.delete(`/api/event/${eventId}`);
  }
}
