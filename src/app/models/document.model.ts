export class Document {
  _id: string;
  title: string;

  groups: any[];

  revisions: any[];

  comments: {
    text: string;

    author: {
      _id: string;
      username: string;
      name: {
        first: string;
        last: string;
      }
    };

    creationDate: string;
    revision: number;
  };

  template: boolean;
  coreTemplate: boolean;
  completionEstimate: number;
  locked: boolean;
}
