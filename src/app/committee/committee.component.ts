import { Component, OnInit } from '@angular/core';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { UserResponse } from '../models/user-response.model';

import { GroupManagerService } from '../group-manager/group-manager.service';

@Component({
  selector: 'prism-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css']
})
export class CommitteeComponent implements OnInit {
  prs: any[] = [];
  currentUser: UserResponse;

  constructor(private groupManagerService: GroupManagerService) { }

  ngOnInit() {
    const castedUser: UserResponse = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = new UserResponse(castedUser.user, castedUser.groups, castedUser.token);

    this.groupManagerService.getPrs().subscribe( data => {
      const members: User[] = <User[]> data.members;
      this.prs = members.sort(this.compareUsernames);
    })
  }

  /* Function to sort group by username in alphabetical order */
  compareUsernames(user1: User, user2: User): number {
    const username1 = user1.username.toLowerCase();
    const username2 = user2.username.toLowerCase();

    if (username1 > username2) {
      return 1;
    } else if (username1 < username2) {
      return -1;
    }
    return 0;
  }
}
