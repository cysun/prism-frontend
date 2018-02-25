import { College } from './college.model';

export class Department {
  _id: string;
  name: string;
  abbreviation: string;
  college: College;
  chairs: any[];
}
