import { Document } from './document.model';
import { Group } from './group.model';
import { User } from './user.model';

export class Event {
  _id: string;

  title: string;
  date: Date;
  canceled: boolean;
  sendNotifications: boolean;
  documents: Document[] | string[];
  groups: Group[] | string[];
  people: User[] | string[];
}
