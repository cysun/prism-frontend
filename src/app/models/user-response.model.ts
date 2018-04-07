import { User } from './user.model';

export class UserResponse {
  user: User;

  groups: [{
    name: string,
    _id: string;
  }];

  token: string;
}
