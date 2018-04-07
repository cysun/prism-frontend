import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SharedService {
  searchUser: string;
  filteredUsers: string[];

  prsMembersList: string[];

  isAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = currentUser.groups.some( user => user.name === 'Administrators');

    return isAdmin;
  }
}
