import { User } from './user.model';

export class Comment {
  _id: string;
  text: string;
  creationDate: Date;
  author: User | string;
  revision: number;
  originalFilename: string;
}
