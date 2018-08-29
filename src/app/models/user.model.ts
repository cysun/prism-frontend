import * as _ from 'lodash';
import { Group } from './group.model';

export class User {
  _id: string;
  username: string;
  email: string;

  name: {
    first: string;
    last: string;
  };

  groups: Group[] | string[];

  internal: boolean;
  root: boolean;
  disabled: boolean;

  get fullName() {
    return (this.name.first + ' ' + this.name.last).trim();
  }

  set fullName(name: string) {
    const words = _.compact(name.split(' '));
    if (words.length < 1) {
      this.name.first = '';
      this.name.last = '';
    } else if (words.length < 2) {
      this.name.first = words[0];
      this.name.last = '';
    } else {
      this.name.first = words[0];
      this.name.last = words.slice(1).join(' ');
    }
  }
}
