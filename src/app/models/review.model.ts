import { Program } from './program.model';
import { ReviewNode } from './review_node.model';
import { User } from './user.model';

export class Review {
  _id: string;
  program: string | Program;
  startDate: string;
  finishDate: string;
  leadReviewers: string[] | User[];
  endNodes: string[];
  nodes: {
    [key: string]: ReviewNode;
  };
  deleted: boolean;
  percentComplete: number;
}
