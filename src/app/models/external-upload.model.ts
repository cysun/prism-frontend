import { Document } from './document.model';
import { User } from './user.model';

export class ExternalUpload {
  _id: string;
  document: Document;
  user: User;
  message: string;
  token: string;
}
