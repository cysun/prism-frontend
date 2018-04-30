import { Document } from './document.model';

export class ReviewNode {
  startDate: string;
  finishDate: string;
  completionEstimate: number;
  finishDateOverriden: boolean;
  finalized: boolean;
  email: {
    [key: string]: string;
  };
  document: string | Document;
  prerequisites: string[];
  title: string;
}
