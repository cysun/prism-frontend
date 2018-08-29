import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';

import {
  NgbModal,
  NgbModalRef,
  NgbDateStruct,
  NgbTimeStruct,
  NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';

import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import { Document } from '../../models/document.model';
import { Event } from '../../models/event.model';
import { Globals } from '../../shared/app.global';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';

import { CalendarService } from '../../services/calendar.service';
import { DocumentService } from '../../services/document.service';
import { SharedService } from '../../shared/shared.service';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTitleFormatter,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { isSameDay, isSameMonth } from 'date-fns';
import { saveAs } from 'file-saver';

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

  message: string;
  file: File;
  fileName: string;

  suggestedGroups: Group[];
  suggestedUsers: User[];

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
        this.handleEvent('Delete', event);
      }
    }
  ];

  constructor(private calendarService: CalendarService,
              private dateParser: NgbDateParserFormatter,
              private globals: Globals,
              private modalService: NgbModal,
              private documentService: DocumentService,
              private sharedService: SharedService) {}

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

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if (action === 'Edit') {
      this.openModal(this.addNewEventModal, event.meta._id);
      return;
    } else if (action === 'Delete') {
      this.alert = { message: 'Are you sure you want to delete this event?'};
    }
    this.openModal(this.modalContent, event.meta._id);
  }

  /* Add new event or update an event to the database and calendar */
  submitEvent(action: string) {
    const addGroups = this.sharedService.filteredGroups;
    const addPeople = this.sharedService.filteredUsers;

    if (this.date && ((addPeople && addPeople.length > 0) ||
      (addGroups && addGroups.length > 0))) {
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
          this.inviteToEvent(data._id);
          this.uploadAttachment(data._id);
        })
      } else if ( action === 'Edit') {
        const body = { title: this.newEvent.title, date: this.newEvent.date };
        this.calendarService.updateEvent(this.newEvent._id, body).subscribe( data => {
          const updateEventIndex = this.events.findIndex( currEvent =>
            currEvent.id === this.newEvent._id);
          this.events[updateEventIndex].title = data.title;
          this.events[updateEventIndex].start = new Date(data.date);
          this.events[updateEventIndex].meta = data;
          this.inviteToEvent(this.newEvent._id);

          let docId = '';
          const firstDocument: Document = <Document> this.newEvent.documents[0];
          if (firstDocument) { docId = firstDocument._id; }
          this.uploadAttachment(this.newEvent._id, docId);
        })
      }
      this.activeDayIsOpen = false;
      this.closeModal();
    } else {
      this.alert = {
        message: 'Please select a valid date and/or notify at least one user/group about the event.'
      };
    }
  }

  /* Add event to the actual calendar */
  addEventToCalendar(newEvent: Event): void {
    this.events.push({
      id: newEvent._id,
      start: new Date(newEvent.date),
      title: newEvent.title + (newEvent.canceled ? ' (Canceled)' : ''),
      color: (newEvent.canceled ? this.globals.calendarColors.red : this.globals.calendarColors.yellow),
      actions: this.actions,
      meta: newEvent,
    });
    this.refresh.next();
  }

  /* Add people to event */
  inviteToEvent(eventId: string) {
    const addGroups = this.sharedService.filteredGroups;
    const addPeople = this.sharedService.filteredUsers;

    const body: {[key: string]: string[]} = {};

    if (addGroups) { body.groups = addGroups; }
    if (addPeople) { body.people = addPeople; }

    this.calendarService.updateEvent(eventId, body).subscribe( data => {
      const updateEventIndex = this.events.findIndex( currEvent =>
        currEvent.id === eventId);
      this.events[updateEventIndex].meta = data;
      this.sharedService.filteredGroups = null;
      this.sharedService.filteredUsers = null;
    })
  }

  /* Mark an event as canceled */
  cancelEvent() {
    const eventId = this.modalData.event.meta._id;
    this.calendarService.cancelEvent(eventId).subscribe(() => {
      const findEventIndex = this.events.findIndex( currEvent =>
        currEvent.id === eventId);

        this.events[findEventIndex].title += ' (Canceled)';
        this.events[findEventIndex].meta.canceled = true;
        this.events[findEventIndex].color = this.globals.calendarColors.red;
      })
      this.closeModal();
    }

  /* Delete event from database and calendar */
  deleteEvent(event: CalendarEvent) {
    this.calendarService.deleteEvent(event.id).subscribe( () => {
      this.events = this.events.filter(iEvent => iEvent !== event);
    });
    this.activeDayIsOpen = false;
    this.closeModal();
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
        this.suggestedGroups = <Group[]> this.newEvent.groups;
        this.suggestedUsers = <User[]> this.newEvent.people;
      })
    } else {
      this.newEvent = new Event();
      this.suggestedGroups = [];
      this.suggestedUsers = [];
    }
    this.modal = this.modalService.open(content, this.globals.options);
  }

  /* Closes the current open modal */
  closeModal() {
    this.alert = '';
    this.date = null;
    this.modalData = null;
    this.time = { hour: 9, minute: 0, second: 0 };
    this.modal.close();
  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;

      if (this.file.size > this.globals.maxFileSize) {
        this.alert = { message: 'File is too large to upload.' };
      } else {
        this.alert = '';
      }
    }
  }

  /* Upload revision message and the file being sent */
  uploadAttachment(eventId: string, documentId?: string) {
    if (this.file && this.message && (this.file.size <= this.globals.maxFileSize)) {
      if (documentId && documentId.length > 0) {
        this.documentService.postRevision(documentId, this.message).subscribe( () => {
          const firstDocument: Document = <Document> this.newEvent.documents[0];
          const numOfRevisions = Object.keys(firstDocument.revisions).length;
          this.documentService.uploadFile(documentId, numOfRevisions, this.file).subscribe( () => {
            this.message = '';
            this.file = null;
            this.fileName = '';
          });
        })
      } else {
        this.calendarService.attachDocumentToEvent(eventId, this.message).subscribe( data => {
          const updateEventIndex = this.events.findIndex( currEvent => currEvent.id === eventId);
          this.events[updateEventIndex].meta.documents = data._id;

          this.documentService.postRevision(data._id, this.message).subscribe( () => {
            this.documentService.uploadFile(data._id, 0, this.file).subscribe( () => {
              this.message = '';
              this.file = null;
              this.fileName = '';
            });
          })
        });
      }
    }
  }

  getNumOfRevisions(revisionsArr) {
    return Object.keys(revisionsArr).length;
  }

  downloadFile(documentId: string, revisionIndex: number) {
    this.documentService.downloadFile(documentId, revisionIndex).subscribe ( data => {
      const contentDisposition = data.headers.get('content-disposition');
      const contentType = data.headers.get('content-type');
      const fileName = contentDisposition.slice(22, contentDisposition.length - 1);

      saveAs(new Blob([data.body], { type: contentType }), fileName);
    });
  }
}
