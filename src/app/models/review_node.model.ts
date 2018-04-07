export class ReviewNode {
  startDate: string;
  finishDate: string;
  completionEstimate: number;
  finishDateOverriden: boolean;
  finalized: boolean;
  email: {
    [key: string]: string;
  };
  document: string;
  prerequisites: string[];
  title: string;
}
