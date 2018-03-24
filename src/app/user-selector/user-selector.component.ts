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
  @Input() suggestedMembers: string[];

  filteredUser: string;
  filteredMembers: string[];
  usersList = [];
  suggestedUsers = [];

  constructor(private globals: Globals,
              private userSelectorService: UserSelectorService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.userSelectorService.getUsers().subscribe( data => {
      this.usersList = data;
    })
  }

  submitUser() {
    this.sharedService.searchUser = this.filteredUser;
  }

  submitUsersList() {
    this.sharedService.filteredUsers = this.filteredMembers;
  }
}
