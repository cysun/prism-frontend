import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';

import { NgbModal, NgbModalRef,  NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

import { GroupManagerService } from './group-manager.service';

@Component({
  selector: 'prism-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})

export class GroupManagerComponent implements OnInit {
  displayGroupManager: Boolean = false;

  modal: NgbModalRef;
  options: NgbModalOptions = {
    size: 'lg'
  };

  group: Group = new Group();
  member: User = new User();
  currentUser: User = new User();

  groups: Group[] = [];
  users: User[] = [];
  memberList: User[] = [];

  filteredMembers: any[] = [];
  msgs: Message[] = [];

  suggestedUsers: any[] = [];

  constructor(private groupManagerService: GroupManagerService,
    private modalService: NgbModal,
    private router: Router) { }

    ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

      this.groupManagerService.getUsers().subscribe( data => {
        this.users = data;
        console.log(data);
      })

      /* If current user is logged in, execute function that retrieves editable groups */
      if (this.currentUser.root === true) {
        this.groupManagerService.getGroups().subscribe(data => {
          this.groups = data;

          for (let i = 0; i < this.groups.length; i++) {
            const members = this.groups[i].members;
            this.groups[i].members = this.getMembersObject(members);
          }
          console.log(this.groups)
        },

        err => {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('currentUser');
          this.router.navigate(['login']);
        });
      }
    }

    invalidErrorMessage(message: string) {
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

    /* Open a basic modal */
    openModal(content) {
      this.group = new Group();
      this.modal = this.modalService.open(content, this.options);
    }

    /* Open a modal with purpose of manipulating data */
    editModal(content, groupId: string, memberId?: string) {
      if (this.modal) {
        this.modal.close();
      }

      this.groupManagerService.getGroup(groupId).subscribe( data => {
        this.group = data;
        this.group.members = this.getMembersObject(data.members);

        if (this.group.members.length > 0) {
          this.member = this.group.members.find( item => item._id === memberId);
        }
      });

      this.modal = this.modalService.open(content, this.options);
    }

    /* Closes the current open modal */
    closeModal() {
      this.modal.close();
    }

    /* Displays the manager dialog for the specific group to update its contents */
    groupManagerDialog(id: string) {
      this.msgs = [];
      this.filteredMembers = [];
      this.suggestedUsers = [];
      this.displayGroupManager = true;
      this.groupManagerService.getGroup(id).subscribe( data => {
        this.group = data;
        this.getMembersObject(data.members);
      });
    }

    /* Function to add a new group */
    submitGroup() {
      if (typeof(this.group.name) !== 'undefined') {
        if (this.group.name.trim().length > 0) {
          const groupExists = this.groups.some( checkGroup =>
            checkGroup.name.toLowerCase() === this.group.name.toLowerCase()
          );

          if (!groupExists) {
            this.groupManagerService.addGroup(this.group).subscribe( data => {
              this.groups.push(data);
              this.groups = this.groups.slice(0);
            }
          );
          this.closeModal();
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

  /* Function to delete an existing group */
  deleteGroup(id: string) {
    if (typeof(id) !== 'undefined') {
      this.groupManagerService.deleteGroup(id).subscribe( () => {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i]._id === id) {
            this.groups.splice(i, 1);
            break;
          }
        }
      });

      this.closeModal();
      this.group = new Group();
    } else {
      this.invalidErrorMessage('invalid delete');
    }
  }

  /* Function to update a group's name and members */
  updateGroup() {
    const findGroup = this.groups.find( item => item._id === this.group._id);
    const nameChange = findGroup.name === this.group.name ? false : true;

    /* Updating the group's name */
    if (this.group.name.trim().length > 0) {
      if (nameChange) {
        this.groupManagerService.updateGroup(this.group).subscribe( updatedGroup => {
          const index = this.groups.findIndex(oldGroup => oldGroup._id === updatedGroup._id);
          this.groups[index] = updatedGroup;
        });
      }
    } else {
      this.invalidErrorMessage('empty group');
    }

    /* Adding members to the group */
    if (this.suggestedUsers.length !== 0 ) {
      for (let i = 0; i < this.suggestedUsers.length; i++) {
        const userObj = this.users.find(foundUser => foundUser.username === this.suggestedUsers[i].name);

        this.groupManagerService.addMember(userObj._id, this.group._id).subscribe( newMember => {
          findGroup.members.push(newMember);
          // this.groups = this.groups.slice(0);
        })
      }
    }

    this.group = new Group();

    this.modal.close();
    this.suggestedUsers = [];
  }

  /* Function delete a member off of the selected group */
  deleteMember() {
    this.groupManagerService.deleteMember(this.group._id, this.member._id).subscribe( () => {
      for (let i = 0; i < this.groups.length; i++) {
        if (this.groups[i]._id === this.group._id) {
          for (let j = 0; j < this.groups[i].members.length; j++) {
            if (this.groups[i].members[j]._id === this.member._id) {
              this.groups[i].members.splice(j, 1);
              break;
            }
          }
        }
      }
    })
    this.closeModal();
  }

  /* Give a group's member list of IDs and return their corresponding member objects */
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

  /* Populates filteredMembers array with given suggested users to add to the group */
  filteredUsers(event) {
    this.filteredMembers = [];
    const query = event.query;
    this.filteredMembers = this.getSuggestedUsers(query, this.users);
  }

  /* Function that returns a list of suggested users based on user's current field input */
  getSuggestedUsers(username: string, users: any[]): any[] {
    const filtered = [];
    const currentMembers = this.getMembersObject(this.group.members);

    /* Push matching usernames to filtered list */
    for (let i = 0; i < users.length; i ++) {
      if ((users[i].username).toLowerCase().indexOf(username.toLowerCase()) === 0) {
        filtered.push({'name': users[i].username});
      }
    }

    /* Filter out members that are already part of the group */
    for (let i = 0; i < currentMembers.length; i++) {
      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j].name === currentMembers[i].username) {
          filtered.splice(j, 1);
        }
      }
    }

    /* Filter out usernames that were previously selected (but not added to the group) */
    for (let i = 0; i < this.suggestedUsers.length; i++) {
      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j].name === this.suggestedUsers[i].name) {
          filtered.splice(j, 1);
        }
      }
    }

    filtered.sort(this.compareUsernames);

    return filtered;
  }

  /* Function to sort the suggested user list in alphabetical order */
  compareUsernames(user1, user2) {
    const username1 = user1.name.toLowerCase();
    const username2 = user2.name.toLowerCase();

    let compare = 0;

    if (username1 > username2) {
      compare = 1;
    } else if (username1 < username2) {
      compare = -1;
    }
    return compare;
  }
}
