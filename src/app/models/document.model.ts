import { Comment } from './comment.model';
import { Revision } from './revision.model';

export class Document {
  _id: string;
  title: string;

  groups: any[];
  revisions: Revision[];
  comments: Comment[];
  subscribers: any[];

  template: boolean;
  coreTemplate: boolean;
  completionEstimate: number;
  locked: boolean;
}
