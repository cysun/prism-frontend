import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

import { Globals } from '../shared/app.global';
import { GroupManagerService } from './group-manager.service';

@Component({
  selector: 'prism-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})

export class GroupManagerComponent implements OnInit {
  modal: NgbModalRef;

  member: string;
  currentUser: User = new User();
  group: Group = new Group();

  groups: Group[] = [];
  users: User[] = [];
  memberList: User[] = [];

  filteredMembers: any[] = [];
  suggestedUsers = [];
  alert: any;

  constructor(private groupManagerService: GroupManagerService,
    private modalService: NgbModal,
    private router: Router,
    private globals: Globals) { }

    ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

      this.groupManagerService.getUsers().subscribe( data => {
        this.users = data;
        this.suggestedUsers = data;
      })
        this.getAllGroups();
    }

    /* Error messages when performing invalid actions */
    invalidErrorMessage(message: string) {
      this.alert = '';
      let detailMsg = '';

      switch (message) {
        case 'empty group':
        detailMsg = 'Please input a group name.';
        break;
        case 'existing group':
        detailMsg = 'Name of group already exists.';
        break;
      }
      this.alert = { message: detailMsg };
    }

    /* Open a basic modal */
    openModal(content) {
      this.group = new Group();
      this.modal = this.modalService.open(content, this.globals.options);
    }

    /* Open a modal with purpose of manipulating data */
    editModal(content, groupId: string, memberId?: string) {
      this.filteredMembers = [];

      if (this.modal) { this.modal.close(); }

      this.getUserList().then( () => {
        this.groupManagerService.getGroup(groupId).subscribe( data => {
          this.group = data;

          for ( let i = 0; i < this.group.members.length; i++) {
            for (let j = 0; j < this.suggestedUsers.length; j++) {
              if (this.group.members[i] === this.suggestedUsers[j]._id) {
                this.suggestedUsers.splice(j, 1);
              }
            }
          }

          if (this.group.members.length > 0) {
            this.member = this.group.members.find( item => item === memberId);
          }
        });
        this.modal = this.modalService.open(content, this.globals.options);
      })
    }

    /* Closes the current open modal */
    closeModal() {
      this.alert = '';
      this.suggestedUsers = this.users;
      this.modal.close();
    }

    /* Returns the list of groups */
    getAllGroups() {
      return new Promise((resolve, reject) => {
        this.groupManagerService.getGroups().subscribe( data => {
          this.groups = data;

          for (let i = 0; i < this.groups.length; i++) {
            const members = this.groups[i].members;
            this.groups[i].members = this.getMembersObject(members);
          }
          console.log(this.groups)
          resolve();
        }, err => {
          console.log(err);
          reject();
        })
      });
    }

    /* Grab all users up-to-date */
    getUserList() {
      return new Promise((resolve, reject) => {
        this.groupManagerService.getUsers().subscribe( data => {
          this.users = data;
          this.suggestedUsers = data;
          this.suggestedUsers.sort(this.compareUsernames)
          resolve();
        })
      });
    }

    /* Function to add a new group */
    submitGroup() {
      if (this.group.name) {
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
    this.groupManagerService.deleteGroup(id).subscribe( () => {
      for (let i = 0; i < this.groups.length; i++) {
        if (this.groups[i]._id === id) {
          this.groups.splice(i, 1);
          break;
        }
      }
    });
    this.closeModal();
  }

  /* Function to update a group's name and members */
  updateGroup() {
    /* Checks to see if there is a name change */
    const findGroup = this.groups.find( item => item._id === this.group._id);
    const nameChange = findGroup.name === this.group.name ? false : true;

    /* Updating the group's name */
    if (this.group.name.trim().length > 0 && nameChange) {
      /* Checks if there is already a group with the given name */
      if (this.groups.some(existingGroupName =>
        existingGroupName.name.toLowerCase() === this.group.name.toLowerCase())) {
          this.invalidErrorMessage('existing group');
        } else {
          this.groupManagerService.updateGroup(this.group).subscribe( updatedGroup => {
            const index = this.groups.findIndex(oldGroup => oldGroup._id === updatedGroup._id);
            updatedGroup.members = this.getMembersObject(updatedGroup.members);
            this.groups[index] = updatedGroup;
            this.modal.close();
          });
        }
      } else {
        if (!nameChange) { this.modal.close(); } else { this.invalidErrorMessage('empty group'); }
      }

      /* Adding members to the group */
      if (this.filteredMembers.length > 0) {
        for (let i = 0; i < this.filteredMembers.length; i++) {
          this.groupManagerService.addMember(this.filteredMembers[i], this.group._id).subscribe( () => {
            const newMember = this.getMembersObject([this.filteredMembers[i]]);
            const groupIndex = this.groups.findIndex(getGroup => getGroup._id === this.group._id);
            this.groups[groupIndex].members.push(newMember[0]);
          })
        }
        this.modal.close();
      }
    }

    /* Function delete a member off of the selected group */
    deleteMember() {
      this.groupManagerService.deleteMember(this.group._id, this.member).subscribe( () => {
        const findGroupIndex = this.groups.findIndex( item => item._id === this.group._id);

        for (let i = 0; i < this.groups[findGroupIndex].members.length; i++) {
          if (this.groups[findGroupIndex].members[i]._id === this.member) {
            this.groups[findGroupIndex].members.splice(i, 1);
            break;
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

    /* Function to sort the suggested user list in alphabetical order */
    compareUsernames(user1: User, user2: User) {
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
