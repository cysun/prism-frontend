import { Component, Input, OnInit } from '@angular/core';

import { Globals } from '../shared/app.global';
import { SharedService } from '../shared/shared.service';
import { UserSelectorService } from './user-selector.service';

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
              private userSelectorService: UserSelectorService,
              private sharedService: SharedService) { }

  ngOnInit() {
    if (this.configType === 'groups') {
      this.userSelectorService.getGroups().subscribe( data => {
        this.suggestedGroups = data;
        this.sharedService.groupsList = this.suggestedGroups;
        this.filteredGroups = this.suggestedMembers;
      })
    } else if (this.filterType === 'prs') {
      this.userSelectorService.getPrsUsers().subscribe( data => {
        this.suggestedUsers = data.members;
        this.sharedService.prsMembersList = this.suggestedUsers;
      })
    } else if (this.configType === 'multiple') {
      this.userSelectorService.getUsers().subscribe( data => {
        this.suggestedUsers = data;
        this.filteredMembers = this.suggestedMembers;
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
