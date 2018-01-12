import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

import { GroupManagerService } from './group-manager.service';

@Component({
  selector: 'prism-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})

export class GroupManagerComponent implements OnInit {
  displayAdd: Boolean = false;
  displayDelete: Boolean = false;
  displayGroupManager: Boolean = false;

  group: Group = new Group();
  user: User = new User();

  groups: Group[] = [];
  users: User[] = [];
  groupMembers: User[] = [];
  memberList: User[] = [];

  filteredMembers: User[] = [];
  msgs: Message[] = [];

  displayList: any[] = [];

  constructor(private groupManagerService: GroupManagerService,
              private router: Router) { }

  ngOnInit() {
    this.groupManagerService.getGroups().subscribe(data => {
      this.groups = data;
      console.log(data);
    });

    this.groupManagerService.getUsers().subscribe( data => {
      this.users = data;
      console.log(data);
    })

  }

  invalidErrorMessage(message) {
    this.msgs = [];
    let detailMsg = '';

    switch (message) {
      case 'empty group':
        detailMsg = 'Please input a group name.';
        break;
      case 'invalid delete':
        detailMsg = 'Please select a valid group to delete.';
        break;
      case 'existing group':
        detailMsg = 'Name of group already exists.'
        break;
    }
    this.msgs.push({severity: 'error', summary: 'Invalid Group:', detail: detailMsg });
  }

  addGroupDialog() {
    this.msgs = [];
    this.group = new Group();
    this.displayAdd = true;
  }

  deleteGroupDialog() {
    this.msgs = [];
    this.displayDelete = true;
    this.group = new Group();
  }

  groupManagerDialog(id) {
    this.msgs = [];
    this.displayGroupManager = true;
    this.groupManagerService.getGroup(id).subscribe(data => {
      this.group = data;
      this.listMembers(data.members);
    });
  }

  submitGroup() {
    if (typeof(this.group.name) !== 'undefined') {
      if (this.group.name.trim().length > 0) {
        const groupExists = this.groups.some( checkGroup =>
          checkGroup.name.toLowerCase() === this.group.name.toLowerCase()
        );

        if (!groupExists) {
          this.groupManagerService.addGroup(this.group).subscribe(
            data => {
              this.groups.push(data);
              this.groups = this.groups.slice(0);
            }
          );

          this.displayAdd = false;
          this.group = new Group();
        } else {
          this.invalidErrorMessage('existing group');
        }
      } else {
        this.invalidErrorMessage('empty group');
      }
    } else {
      this.invalidErrorMessage('empty group');
    }
  }

  deleteGroup(id) {
    if (typeof(id) !== 'undefined') {
      this.groupManagerService.deleteGroup(id).subscribe( () => {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i]._id === id) {
            this.groups.splice(i, 1);
            this.groups = this.groups.slice(0);
            break;
          }
        }
      });

      this.displayGroupManager = false;
      this.group = new Group();
    } else {
      this.invalidErrorMessage('invalid delete');
    }
  }

  updateGroup() {
    if (this.group.name.trim().length > 0) {
      this.groupManagerService.updateGroup(this.group).subscribe( updatedGroup => {
        const index = this.groups.findIndex(oldGroup => oldGroup._id === updatedGroup._id);
        this.groups[index] = updatedGroup;
      });

      this.displayGroupManager = false;
      this.group = new Group();
    } else {
      this.invalidErrorMessage('empty group');
    }
  }

  listMembers(memberList) {
    this.displayList = [];

    for (let i = 0; i < memberList.length; i++) {
      this.groupManagerService.getUser(memberList[i]).subscribe( data => {
        this.displayList.push({'name': data.username});
      })
    }
  }

  getGroupMemberList(id) {
    this.groupManagerService.getGroup(id).subscribe( data => {
      this.groupMembers = data.members;
      this.listMembers(this.groupMembers);
    })
  }

  filteredUsers(event) {
    const query = event.query;
    this.groupManagerService.getUsers().subscribe( users => {
      this.filteredMembers = this.getUser(query, users);
    })
  }

  getUser(username, users: any[]): any[] {
    const filtered = [];

    this.groupManagerService.getUsers().subscribe( () => {
      for (let i = 0; i < this.users.length; i ++) {
        if ((this.users[i].username).toLowerCase().indexOf(username.toLowerCase()) === 0) {
          filtered.push(this.users[i]);
          break;
        }
      }
    });

    return filtered;

    // this.groupManagerService.searchUser('testRoot8').subscribe( data => {
    //   console.log('Testing if can filter a user by username: ');
    //   console.log(data);
    // })
  }
}
