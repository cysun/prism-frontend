export interface UserResponse {
  user: {
    username: string,
    name: {
      first: string,
      last: string
    }
  },

  groups: [{
    name: string,
    _id: string;
  }],

  token: string;
}
