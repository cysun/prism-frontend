import { User } from './user.model';

export interface Group {
  name: string;
  members: [User];
}
