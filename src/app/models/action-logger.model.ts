export class ActionLogger {
  _id: string;
  text: string;

  user: {
    _id: string;
    username: string;
    email: string;

    name: {
      last: string;
      first: string;
    };
  };

  object: string;
  type: string;
  date: Date;
}
