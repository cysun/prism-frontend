import { Department } from './department.model';

export class Program {
  _id: string;
  name: string;
  department: string | Department;
  nextReviewDate: string;
}
