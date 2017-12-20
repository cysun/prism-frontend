export interface User {
  username: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
  internal: boolean;
  root: boolean;
  samlType: string;
  passwordHash: string;
}
