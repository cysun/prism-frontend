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

  filteredUser: string;
  filteredMembers: string[];
  usersList = [];
  suggestedUsers = [];

  constructor(private globals: Globals,
              private userSelectorService: UserSelectorService,
              private sharedService: SharedService) { }

  ngOnInit() {
    if (this.suggestedMembers === undefined) {
      if (this.filterType === 'prs') {
        this.userSelectorService.getPrsUsers().subscribe( data => {
          this.suggestedUsers = data.members;
        })
      } else {
        this.userSelectorService.getUsers().subscribe( data => {
          this.usersList = data;
          if (this.configType === 'multiple') { this.suggestedUsers = data; }
        })
      }
    } else {
      this.suggestedUsers = this.suggestedMembers;
    }
  }

  submitUser() {
    this.sharedService.searchUser = this.filteredUser;
  }

  submitUsersList() {
    this.sharedService.filteredUsers = this.filteredMembers;
  }
}
