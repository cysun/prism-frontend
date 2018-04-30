import { College } from './college.model';
import { User } from './user.model';

export class Department {
  _id: string;
  name: string;
  abbreviation: string;
  college: College | string;
  chairs: User[] | string[];
}
