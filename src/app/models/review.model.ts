import { ReviewNode } from './review_node.model';

export class Review {
  _id: string;
  program: string;
  startDate: string;
  finishDate: string;
  leadReviewers: string[];
  endNodes: string[];
  nodes: {
    [key: string]: ReviewNode;
  };
  deleted: boolean;
  percentComplete: number;
}
