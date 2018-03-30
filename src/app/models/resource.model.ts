export class Resource {
  _id: string;
  title: string;
  files: [{
    _id: string;
    message: string;
    filename: string;
    uploader: {
      _id: string;
      username: string;
    };
    dateUploaded: Date;
  }];
}
