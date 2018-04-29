import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { User } from '../models/user.model';


@Injectable()
export class SharedService {
  searchUser: string;
  filteredUsers: string[];
  filteredGroups: string[];
  filteredGroups2: string[];

  prsMembersList: any[];
  groupsList: string[];

  isAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = currentUser.groups.some( group => group.name === 'Administrators');

    return isAdmin || currentUser.root;
  }

  isAdminOrPrs(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdminOrPrs = currentUser.groups.some( group => group.name === 'Administrators'
      || group.name === 'Program Review Subcommittee');

    return isAdminOrPrs || currentUser.root;
  }
}
