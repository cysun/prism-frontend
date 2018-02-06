export class Document {
  _id: String;
  title: String;

  groups: any[];

  revisions: {
    message: String;
    filename: String;
    fileExtension: String;
    dateUploaded: Date;

    uploader: {
      _id: String;
      username: String;
    },

    template: Boolean;
    deleted: Boolean;
  };

  comments: {
    text: String;

    author: {
      _id: String;
      username: String;
      name: {
        first: String;
        last: String;
      }
    };

    creationDate: String;
    revision: Number;
  };

  template: Boolean;
  coreTemplate: Boolean;
  completionEstimate: Number;
}
