import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';

import {
  NgbModal,
  NgbModalRef,
  NgbTimeStruct,
  NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';

import { Event } from '../models/event.model';
import { CalendarService } from './calendar.service';
import { Globals } from '../shared/app.global';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTitleFormatter,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

import { isSameDay, isSameMonth } from 'date-fns';

@Component({
  selector: 'prism-calendar',
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CalendarComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

  activeDayIsOpen = false;
  newEvent: Event;
  view = 'month';
  viewDate: Date = new Date();

  alert: any;
  events: CalendarEvent[] = [];
  meridian = true;
  modal: NgbModalRef;
  refresh: Subject<any> = new Subject();
  time: NgbTimeStruct;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.calendarService.deleteEvent(event.id).subscribe( () => {
          const deleteEventIndex = this.events.findIndex(
            deleteEvent => deleteEvent.id === event.id);
        });
      //  this.handleEvent('Deleted', event);
      }
    }
  ];

  constructor(private calendarService: CalendarService,
              private dateParser: NgbDateParserFormatter,
              private globals: Globals,
              private modalService: NgbModal) {}

  ngOnInit() {
    this.time = { hour: 13, minute: 0, second: 0 };
    this.calendarService.getAllEvents().subscribe( data => {
      for (let i = 0; i < data.length; i++) {
        this.addEvent(data[i]);
      }
    })
  }

  /* Shows a drop down of a particular eventful day */
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal = this.modalService.open(this.modalContent, this.globals.options);
  }

  /* Add new event to the database and calendar */
  submitEvent(newEventDate) {
    if (newEventDate) {
      this.newEvent.date = new Date(newEventDate.year, newEventDate.month - 1,
        newEventDate.day, this.time.hour, this.time.minute, this.time.second);

      this.calendarService.addEvent(this.newEvent.title, this.newEvent.date).subscribe( data => {
        this.addEvent(data);
        this.closeModal();
      })
    } else {
      this.alert = { message: 'Please select a valid date for the event.'};
    }
  }

  /* Add event to the actual calendar */
  addEvent(newEvent: Event): void {
    this.events.push({
      id: newEvent._id,
      start: new Date(newEvent.date),
      title: newEvent.title,
      color: this.colors.red,
      actions: this.actions,
      meta: newEvent,
    });
    this.refresh.next();
  }

  /* Open modal */
  openModal(content) {
    this.newEvent = new Event();
    this.modal = this.modalService.open(content, this.globals.options);
  }

  /* Closes the current open modal */
  closeModal() {
    this.alert = '';
    this.time = { hour: 13, minute: 0, second: 0 };
    this.modal.close();
  }
}
