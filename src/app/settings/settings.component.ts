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

  newPassword: string;
  confirmPassword: string;

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
    this.newPassword = '';
    this.confirmPassword = '';
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
      detailMsg = 'Please input a valid e-mail.';
      break;
      case 'password mismatch':
      detailMsg = 'Your new password and confirmation password do not match.';
      break;
    }
    this.alert = { message: detailMsg };
  }

  /* Update user's basic information */
  updateBasicInfo() {
    let validInfo = true;
    let validPassword = true;

    /* Changing name and/or email */
    const emptyFields = (this.currentUser.name.first.trim().length > 0) &&
    (this.currentUser.name.last.trim().length > 0) &&
    (this.currentUser.email.trim().length > 0);

    /* Changing password */
    const passwordFields = this.newPassword && this.confirmPassword;

    if (emptyFields) {
      this.settingsService.updateBasicInfo(this.currentUser).subscribe( data => {
        this.currentUser = data;

        this.updateSettings = true;

        if (!passwordFields) {
          this.alert = '';
          this.updateInfo = false;
        }
      }, (err) => {
        console.log(err)
        this.invalidErrorMessage('invalid email');
      })
    } else {
      this.invalidErrorMessage('empty fields');
      validInfo = false;

      if (this.currentUser.name.first.trim().length <= 0) {
        this.reasons.push('First Name');
      }

      if (this.currentUser.name.last.trim().length <= 0) {
        this.reasons.push('Last Name');
      }

      if (this.currentUser.email.trim().length <= 0) {
        this.reasons.push('Email')
      }
    }

    if (passwordFields && validInfo) {
      console.log('status of safe Info: ' + validInfo)
      if (this.newPassword !== this.confirmPassword) {
        this.invalidErrorMessage('password mismatch');
        validPassword = false;
      } else {
        this.updatePassword();
      }
    }

    /* If there are any errors, don't close update form unless cancel button */
    if (validInfo && validPassword) {
      this.alert = '';
      this.updateInfo = false;
    }
  }

  /* Update user's password */
  updatePassword() {
    this.settingsService.changePassword(this.currentUser._id, this.newPassword).subscribe( data => {
      console.log(data);
    });
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
