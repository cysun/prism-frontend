import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { User } from '../models/user.model';


@Injectable()
export class SharedService {
  searchUser: string;
  filteredUsers: string[];
  filteredGroups: string[];

  prsMembersList: string[];
  groupsList: string[];

  isAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = currentUser.groups.some( user => user.name === 'Administrators');

    return isAdmin;
  }
}
