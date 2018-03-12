export class Document {
  _id: string;
  title: string;

  groups: any[];
  revisions: any[];
  comments: any[];
  subscribers: any[];

  template: boolean;
  coreTemplate: boolean;
  completionEstimate: number;
  locked: boolean;
}
