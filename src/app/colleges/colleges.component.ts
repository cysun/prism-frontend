import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { NgbModule, NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { CollegesService } from './colleges.service';
import { DepartmentService } from './departments/department.service';

import { User } from '../models/user.model';
import { College } from '../models/college.model';
import { Department } from '../models/department.model';
import { Group } from '../models/group.model';

@Component({
  selector: 'prism-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.css']
})

export class CollegesComponent implements OnInit {
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };
  alerts: IAlert[] = [];
  department: Department = new Department();
  departments: Department[] = [];
  currentUser: User = new User();
  college: College = new College();
  colleges: College[] = [];
  users: User[] = [];
  dean: User = new User();
  deans: User[] = [];
  isAdmin: boolean;
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term.length < 2 ? []
        : this.getSuggestedUsers(term, this.users));

  constructor(private collegesService: CollegesService,
    private departmentService: DepartmentService, private router: Router, private modalService: NgbModal) { }

  // Fetch colleges and users
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isAdmin = (<Group[]> this.currentUser.groups).some( x => x.name === 'Administrators')
    this.collegesService.getColleges().subscribe( data => {
      this.colleges = data;
    });
    this.collegesService.getUsers().subscribe( data => {
      this.users = data;
    });
  }

  // Error Messaging
  invalidErrorMessage(message) {
    this.alerts = [];
    let detailMsg = '';

    switch (message) {
      case 'empty college':
        detailMsg = 'Please input a college name.';
        break;
      case 'empty abbreviation':
        detailMsg = 'Please input an abbreviation.';
        break;
      case 'empty departments':
        detailMsg = 'Please input a department name.';
        break;
      case 'existing college':
        detailMsg = 'Name of college already exists!';
        break;
      case 'update abbreviation':
        detailMsg = 'Must update college abbreviation.'
        break;
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  closeModal() {
    this.alerts = [];
    this.modal.close();
  }

  addCollegeDialog(content) {
    this.alerts = [];
    this.modal = this.modalService.open(content, this.options);
    this.college = new College();
  }

  deleteCollegeDialog(content, college) {
    this.departmentService.getDepartmentsAt(college._id).subscribe( data => {
      this.departments = data;
    })
    this.college = college;
    this.modal = this.modalService.open(content, this.options);
  }

  viewDeansDialog(content, college: any) {
    this.deans = college.deans;
    this.collegesService.getCollege(college._id).subscribe( data => {
      this.college = data;
      this.college.deans = this.getDeansObject(data.deans);
      if (this.college.deans.length > 0) {
        this.deans = <User[]> this.college.deans;
      }
    });
    this.modal = this.modalService.open(content, this.options);
  }

  manageCollegeDialog(content, collegeId: string) {
    this.alerts = [];
    this.collegesService.getCollege(collegeId).subscribe( data => {
      this.college = data;
      this.college.deans = this.getDeansObject(data.deans);
      this.deans = <User[]> this.college.deans;
    });
    this.modal = this.modalService.open(content, this.options);
  }

  submitCollege() {
    this.alerts = [];
    if (typeof(this.college.name) !== 'undefined' && this.college.name.trim().length > 0) {
      if (typeof(this.college.abbreviation) !== 'undefined' && this.college.abbreviation.trim().length > 0) {
        if (this.colleges.find(item => item.name === this.college.name)) {
          this.invalidErrorMessage('existing college');
        } else {
          this.collegesService.addCollege(this.college).subscribe(
            data => {
              this.colleges.push(data);
            }
          );
          this.college = new College();
          this.modal.close();
        }
      } else {
          this.invalidErrorMessage('empty abbreviation');
        }
    } else {
      this.invalidErrorMessage('empty college');
    }
  }

  deleteCollege() {
    this.collegesService.deleteCollege(this.college._id).subscribe(() => {
      const index = this.colleges.indexOf(this.college);
      this.colleges.splice(index, 1);
    });
    this.college = new College();
    this.modal.close();
  }

  updateCollege() {
    this.alerts = [];
    const collegeTarget = this.colleges.find(item => item._id === this.college._id);
    const changed = collegeTarget.name !== this.college.name ||
      collegeTarget.abbreviation !== this.college.abbreviation ||
      !this.arraysEqual(collegeTarget.deans, this.college.deans) ? true : false;

    if (changed) {
      if (this.college.name.trim().length > 0) {
        if (this.colleges.some(existingCollege =>
          existingCollege.name.toLowerCase() === this.college.name.toLowerCase() && existingCollege._id !== this.college._id)) {
            this.invalidErrorMessage('existing college');
          } else {
            if (this.college.abbreviation.trim().length > 0) {
              this.collegesService.updateCollege(this.college).subscribe( updatedCollege => {
                const index = this.colleges.findIndex(oldCollege => oldCollege._id === updatedCollege._id);
                this.colleges[index] = updatedCollege;
                this.college = new College();
                this.modal.close();
              });
            } else {
              this.invalidErrorMessage('empty abbreviation')
            }
          }
        } else {
          this.invalidErrorMessage('empty college')
        }
    } else {
      this.modal.close();
    }
  }

  addDean() {
    if (typeof(this.dean.username) !== 'undefined' && this.dean.username.trim().length > 0) {
      const userObj = this.users.find(item => item.username === this.dean.username);

      if (userObj) {
        this.deans.push(userObj);
        const deanIds = this.deans.map(dean => dean._id);
        this.college.deans = deanIds;
        this.collegesService.updateCollege(this.college).subscribe( updatedCollege => {
          const index = this.colleges.findIndex(oldCollege => oldCollege._id === updatedCollege._id);
          this.colleges[index] = updatedCollege;
        });
        this.dean = new User();
      }
    }
  }

  deleteDean(dean) {
    this.alerts = [];
    this.alerts.push({type: 'warning', message: `${dean.username} was removed from the dean list`});
    const index = this.deans.indexOf(dean);
    this.deans.splice(index, 1);
    const deanIds = this.deans.map(deanUser => deanUser._id);
    this.college.deans = deanIds;
    this.collegesService.updateCollege(this.college).subscribe( updatedCollege => {
      const idx = this.colleges.findIndex(oldCollege => oldCollege._id === updatedCollege._id);
      this.colleges[idx] = updatedCollege;
    });
  }

  arraysEqual(a: any[] , b: any[]) {
    if (a === b) { return true; }
    if (a == null || b == null) { return false; }
    if (a.length !== b.length) { return false; }

    a.sort();
    b.sort();

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  }

  /* Give a deans' member list of IDs and return their corresponding member objects */
  getDeansObject(deanList: any[]): any[] {
    const displayList = [];

    for (let i = 0; i < deanList.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (deanList[i]._id === this.users[j]._id) {
          displayList.push(this.users[j]);
        }
      }
    }
    return displayList;
  }

  /* Function that returns a list of suggested users based on user's current field input */
  getSuggestedUsers(username: string, users: any[]): any[] {
    const filtered = [];
    const used = new Array(users.length);

    used.fill(false);
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < this.deans.length; j++) {
        if (users[i].username.toLowerCase() === this.deans[j].username.toLowerCase()) {
          used[i] = true;
        }
      }
    }
    /* Push matching usernames to filtered list */
    for (let pos = 0; pos < users.length; pos ++) {
      if (used[pos]) {
        continue;
      } else {
        if ((users[pos].username).toLowerCase().indexOf(username.toLowerCase()) === 0) {
          filtered.push(users[pos].username);
          used[pos] = true;
        }
      }
    }

    filtered.sort(this.compareUsernames);

    return filtered;
  }

  /* Function to sort the suggested user list in alphabetical order */
  compareUsernames(user1, user2) {
    const username1 = user1.toLowerCase();
    const username2 = user2.toLowerCase();

    if (username1 > username2) {
      return 1;
    } else if (username1 < username2) {
      return -1;
    }
    return 0;
  }
}

export interface IAlert {
  type: string;
  message: string;
}
