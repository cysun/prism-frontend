import { Comment } from './comment.model';
import { Group } from './group.model';
import { Revision } from './revision.model';
import { User } from './user.model';

export class Document {
  _id: string;
  title: string;

  groups: Group[] | string[];
  revisions: Revision[];
  comments: Comment[];
  subscribers: User[] | string[];

  template: boolean;
  coreTemplate: boolean;
  completionEstimate: number;
  locked: boolean;
}
