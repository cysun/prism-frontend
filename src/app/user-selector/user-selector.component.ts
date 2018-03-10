import { Component, OnInit } from '@angular/core';

import { Globals } from '../shared/app.global';
import { SharedService } from '../shared/shared.service';
import { UserSelectorService } from './user-selector.service';

@Component({
  selector: 'prism-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {
  filteredMembers: string;
  suggestedUsers = [];

  constructor(private globals: Globals,
              private userSelectorService: UserSelectorService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.userSelectorService.getUsers().subscribe( data => {
      this.suggestedUsers = data;
    })
  }

  submitUser() {
    this.sharedService.searchUser = this.filteredMembers;
  }
}
