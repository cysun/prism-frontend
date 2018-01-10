export interface User {
  username: string;
  email: string;

  name: {
    first: string;
    last: string;
  };

  internal: boolean;
  root: boolean;
  disabled: boolean;
  samlType: string;
  passwordHash: string;
  
  config: {
    type: {
      email: {
        type: {
          documentFinalized: boolean;
          newComment: boolean;
          meetingChange: boolean;
        }
      }
    }
  };
}
