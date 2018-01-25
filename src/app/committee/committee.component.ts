import { Component, OnInit } from '@angular/core';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

import { GroupManagerService } from '../group-manager/group-manager.service';

@Component({
  selector: 'prism-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css']
})
export class CommitteeComponent implements OnInit {
  groups: Group[] = [];
  users: User[] = [];

  group: Group = new Group();

  constructor(private groupManagerService: GroupManagerService) { }

  ngOnInit() {
    this.groupManagerService.getUsers().subscribe( data => {
      this.users = data;
    })

    this.groupManagerService.getGroups().subscribe( data => {
      this.groups = data;
      this.group = this.groups.find(group => group.name === 'Program Review Subcommittee');

      const members = this.group.members;
      this.group.members = this.getMembersObject(members);
    })
  }

  getMembersObject(memberList: any[]): any[] {
    const displayList = [];

    for (let i = 0; i < memberList.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (memberList[i] === this.users[j]._id) {
          displayList.push(this.users[j]);
        }
      }
    }
    return displayList;
  }
}
