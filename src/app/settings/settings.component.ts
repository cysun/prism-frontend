import { Component, OnInit } from '@angular/core';

import { User } from '../models/user.model';

@Component({
  selector: 'prism-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentUser: User = new User();
  updateInfo: Boolean = false;
  updateSettings: Boolean = false;

  constructor() { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
