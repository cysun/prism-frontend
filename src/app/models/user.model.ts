export class User {
  _id: string;
  username: string;
  email: string;

  name: {
    first: string;
    last: string;
  };

  groups: any[];

  internal: boolean;
  root: boolean;
  disabled: boolean;
}
