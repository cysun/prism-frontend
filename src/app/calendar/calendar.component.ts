import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';

import {
  NgbModal,
  NgbModalRef,
  NgbDateStruct,
  NgbTimeStruct,
  NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';

import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import { Event } from '../models/event.model';
import { CalendarService } from './calendar.service';
import { Globals } from '../shared/app.global';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTitleFormatter,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';


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
  @ViewChild('addNewEventModal') addNewEventModal: TemplateRef<any>;

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
  newEvent: Event = new Event();
  view = 'month';
  viewDate: Date = new Date();

  alert: any;
  date: NgbDateStruct;
  events: CalendarEvent[] = [];
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
        this.handleEvent('Edit', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.calendarService.deleteEvent(event.id).subscribe( () => {
          const deleteEventIndex = this.events.findIndex(
            deleteEvent => deleteEvent.id === event.id);
            this.events.splice(deleteEventIndex, 1);
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
    this.time = { hour: 9, minute: 0, second: 0 };
    this.calendarService.getAllEvents().subscribe( data => {
      for (let i = 0; i < data.length; i++) {
        this.addEventToCalendar(data[i]);
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
    if (action === 'Edit') {
      this.openModal(this.addNewEventModal, event.meta._id);
    } else {
      this.modal = this.modalService.open(this.modalContent, this.globals.options);
    }
  }

  /* Add new event to the database and calendar */
  submitEvent(action: string) {
    if (this.date) {
      this.newEvent.date = new Date(
        this.date.year,
        this.date.month - 1,
        this.date.day,
        this.time.hour,
        this.time.minute,
        this.time.second);

      if (action === 'Submit') {
        this.calendarService.addEvent(this.newEvent.title, this.newEvent.date)
        .subscribe( data => {
          this.addEventToCalendar(data);
        })
      } else if ( action === 'Edit') {
        this.calendarService.updateEvent(
        this.newEvent._id, this.newEvent.title, this.newEvent.date).subscribe( data => {
          const updateEventIndex = this.events.findIndex( currEvent =>
            currEvent.id === this.modalData.event.id);
          this.events[updateEventIndex].start = new Date(data.date);
          this.events[updateEventIndex].meta = data;
        })
      }
      this.closeModal();
    } else {
      this.alert = { message: 'Please select a valid date for the event.'};
    }
  }

  /* Add event to the actual calendar */
  addEventToCalendar(newEvent: Event): void {
    this.events.push({
      id: newEvent._id,
      start: new Date(newEvent.date),
      title: newEvent.title,
      color: this.colors.yellow,
      actions: this.actions,
      meta: newEvent,
    });
    this.refresh.next();
  }

  /* Open modal */
  openModal(content, eventId?: string) {
    if (eventId) {
      this.calendarService.getEvent(eventId).subscribe( data => {
        this.newEvent = data;
        const convertedDate = new Date(this.newEvent.date);

        this.date = {
          year: convertedDate.getFullYear(),
          month: convertedDate.getMonth() + 1,
          day: convertedDate.getDate()
        }

        this.time = {
          hour: convertedDate.getHours(),
          minute: convertedDate.getMinutes(),
          second: convertedDate.getSeconds()
        };
      })
    } else {
      this.newEvent = new Event();
    }
    this.modal = this.modalService.open(content, this.globals.options);
  }

  /* Closes the current open modal */
  closeModal() {
    this.alert = '';
    this.date = null;
    this.time = { hour: 9, minute: 0, second: 0 };
    this.modal.close();
  }
}
