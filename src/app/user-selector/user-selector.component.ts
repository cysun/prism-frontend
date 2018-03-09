import { Component, OnInit } from '@angular/core';

import { Globals } from '../shared/app.global';
import { UserSelectorService } from './user-selector.service';

@Component({
  selector: 'prism-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {
  suggestedUsers = [];

  constructor(private globals: Globals, private userSelectorService: UserSelectorService) { }

  ngOnInit() {
    this.userSelectorService.getUsers().subscribe( data => {
      this.suggestedUsers = data;
    })
  }
}
