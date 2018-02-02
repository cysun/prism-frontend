import { Component, OnInit } from '@angular/core';

import { User } from '../models/user.model';

import { SettingsService } from './settings.service';

@Component({
  selector: 'prism-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  currentUser: User = new User();
  updateInfo: Boolean = false;
  updateSettings: Boolean = false;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.settingsService.getUser(this.currentUser._id).subscribe(data => {
      console.log(data);
    })
  }

  updatePassword(currentPassword: string, newPassword: string, newPassword2: string) {
    this.updateInfo = false;
  }
}
