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

  alert: any;
  reasons: any[];

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.settingsService.getUser(this.currentUser._id).subscribe(data => {
      console.log(data);
      this.currentUser = data;
    })
  }

  /* Toggle the edit button for user's information */
  toggleEditButton() {
    this.settingsService.getUser(this.currentUser._id).subscribe( data => {
      this.currentUser = data;
    })
    this.alert = '';
    this.updateInfo = !this.updateInfo;
  }

  /* Error messages when performing invalid actions */
  invalidErrorMessage(message: string) {
    this.reasons = [];
    let detailMsg = '';

    switch (message) {
      case 'empty fields':
      detailMsg = 'Please fill in all required fields.';
      break;
      case 'invalid email':
      detailMsg = 'Please input a valid e-mail.'
      break;
    }
    this.alert = { message: detailMsg };
  }

  /* Update user's basic information only (not password) */
  updateBasicInfo() {
    const emptyFields = (this.currentUser.name.first.length > 0) &&
    (this.currentUser.name.last.length > 0) &&
    (this.currentUser.email.length > 0);

    if (emptyFields) {
      this.settingsService.updateBasicInfo(this.currentUser).subscribe( data => {
        this.currentUser = data;
        this.updateInfo = false;
        this.alert = '';
      }, (err) => {
        console.log(err)
        this.invalidErrorMessage('invalid email');
      })
    } else {
      this.invalidErrorMessage('empty fields');

      if (this.currentUser.name.first.length <= 0) {
        this.reasons.push('First Name');
      }

      if (this.currentUser.name.last.length <= 0) {
        this.reasons.push('Last Name');
      }

      if (this.currentUser.email.length <= 0) {
        this.reasons.push('Email')
      }
    }
  }

  /* Update user's password */
  updatePassword(currentPassword: string, newPassword: string, newPassword2: string) {
    this.updateInfo = false;
  }
}
