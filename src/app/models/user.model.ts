import { Group } from './group.model';

export class User {
  _id: string;
  username: string;
  email: string;

  name: {
    first: string;
    last: string;
  };

  groups: Group[] | string[];

  internal: boolean;
  root: boolean;
  disabled: boolean;
}
