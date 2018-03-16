export class UserResponse {
  user: {
    _id: string,
    username: string,
    name: {
      first: string,
      last: string
    }
  };

  groups: [{
    name: string,
    _id: string;
  }];

  token: string;
}
