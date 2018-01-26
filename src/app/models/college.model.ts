import { User } from './user.model';

export class College {
  _id: string;
  name: string;
  abbreviation: string;
  deans: [User];
}
