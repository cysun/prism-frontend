export class Document {
  _id: string;
  title: string;

  groups: any[];

  revisions: {
    message: string;
    filename: string;
    fileExtension: string;
    dateUploaded: Date;

    uploader: {
      _id: string;
      username: string;
    },

    template: boolean;
    deleted: boolean;
  };

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
}
