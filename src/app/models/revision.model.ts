export class Revision {
  _id: string;
  dateUploaded: Date;
  message: string;
  originalFilename: string;
  uploader: {
    _id: string;
    username: string;
  };
}
