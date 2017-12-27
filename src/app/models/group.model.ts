import { User } from './user.model';

export class Group {
  _id: string;
  name: string;
  members: [User];
}
