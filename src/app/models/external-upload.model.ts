import { Document } from './document.model';
import { User } from './user.model';

export class ExternalUpload {
  _id: string;
  document: Document | string;
  user: User | string;
  message: string;
  token: string;
  completed: boolean;
  disabled: boolean;
}
