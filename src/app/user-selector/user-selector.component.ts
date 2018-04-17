import { Component, Input, OnInit } from '@angular/core';

import { Globals } from '../shared/app.global';
import { GroupManagerService } from '../group-manager/group-manager.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'prism-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {
  @Input() configType: string;
  @Input() filterType: string;
  @Input() suggestedMembers: any[];

  filteredGroups: string[];
  filteredUser: string;
  filteredMembers: string[];

  suggestedUsers = [];
  suggestedGroups: any[];

  constructor(private globals: Globals,
              private groupManagerService: GroupManagerService,
              private sharedService: SharedService) { }

  ngOnInit() {
    if (this.configType === 'groups') {
      this.groupManagerService.getGroups().subscribe( data => {
        this.suggestedGroups = data;
        this.sharedService.groupsList = this.suggestedGroups;
        this.filteredGroups = this.suggestedMembers;
      })
    } else if (this.filterType === 'prs') {
      this.groupManagerService.getPrs().subscribe( data => {
        this.suggestedUsers = data.members;
        this.sharedService.prsMembersList = this.suggestedUsers;
      })
    } else if (this.configType === 'multiple') {
      if (this.filterType === 'group') {
        this.suggestedUsers = this.suggestedMembers;
      } else {
        this.groupManagerService.getUsers().subscribe( data => {
          this.suggestedUsers = data;
          this.filteredMembers = this.suggestedMembers;
        })
      }
    } else if (this.configType === 'single') {
      this.groupManagerService.getUsers().subscribe( data => {
        this.suggestedUsers = data;
      })
    }
  }

  submitUser() {
    this.sharedService.searchUser = this.filteredUser;
  }

  submitUsersList() {
    this.sharedService.filteredUsers = this.filteredMembers;
  }

  submitGroupsList() {
    this.sharedService.filteredGroups = this.filteredGroups;
  }
}
