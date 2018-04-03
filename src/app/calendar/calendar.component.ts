import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'prism-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events = [];
   view = 'month';
  constructor() { }

  ngOnInit() {
  }

}
