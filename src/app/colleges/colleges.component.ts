import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { NgbModule, NgbModal, NgbModalRef, NgbModalOptions,  } from '@ng-bootstrap/ng-bootstrap';

import { CollegesService } from './colleges.service';
import { DepartmentService } from './departments/department.service';

import { User } from '../models/user.model';
import { College } from '../models/college.model';
import { Department } from '../models/department.model';

@Component({
  selector: 'prism-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.css']
})

export class CollegesComponent implements OnInit {
  @Input()
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };
  alerts: IAlert[] = [];
  department: Department = new Department();
  departments: Department[] = [];
  college: College = new College();
  colleges: College[] = [];
  users: User[] = [];
  dean: User = new User();
  deans: User[] = [];
  suggestedUsers: any[] = [];
  filteredDeans: any[] = [];
  filteredColleges: any[] = [];
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.getSuggestedUsers(term, this.users));

  constructor(private collegesService: CollegesService,
    private departmentService: DepartmentService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.collegesService.getColleges().subscribe( data => {
      this.colleges = data;
      console.log(data);
    });
    this.collegesService.getUsers().subscribe( data => {
      this.users = data;
      console.log(data);
    });
  }

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

  addCollegeDialog(content){
    this.alerts = [];
    this.modal = this.modalService.open(content, this.options);
    this.college = new College();
  }

  deleteCollegeDialog(content, id){
    this.alerts = [];
    this.deleteCollege(id);
    this.modal = this.modalService.open(content, this.options);
  }

  manageCollegeDialog(content, collegeId: string, deanId?: string) {
    this.alerts = [];
    if (this.modal) { this.modal.close(); }

    this.collegesService.getCollege(collegeId).subscribe( data => {
      this.college = data;
      this.college.deans = this.getDeansObject(data.deans);

      if (this.college.deans.length > 0) {
        this.dean = this.college.deans.find( item => item._id === deanId);
      }
    });

    this.modal = this.modalService.open(content, this.options);
  }

  submitCollege() {
    this.alerts = [];
    if (typeof(this.college.name) !== 'undefined' && this.college.name.trim().length > 0) {
      if (typeof(this.college.abbreviation) !== 'undefined' && this.college.abbreviation.trim().length > 0) {
        this.collegesService.addCollege(this.college).subscribe(
          data => {
            this.colleges.push(data);
            this.colleges = this.colleges.slice(0);
          }
        );
        this.college = new College();
        this.modal.close();
      } else {
          this.invalidErrorMessage('empty abbreviation');
        }
    } else {
      this.invalidErrorMessage('empty college');
    }
  }

  deleteCollege(id) {
    this.alerts = [];
      this.collegesService.deleteCollege(id).subscribe(() => {
        for (let i = 0; i < this.colleges.length; i++) {
          if (this.colleges[i]._id === id) {
            this.colleges.splice(i, 1);
            this.colleges = this.colleges.slice(0);
            break;
          }
        }
      });
      this.college = new College();
  }

  updateCollege() {
    this.alerts = [];
    const collegeTarget = this.colleges.find(item => item._id === this.college._id);
    const changed = collegeTarget.name != this.college.name || collegeTarget.abbreviation != this.college.abbreviation || !this.arraysEqual(collegeTarget.deans, this.college.deans) ? true : false;

    if (changed) {
      if (this.college.name.trim().length > 0) {
        if (this.colleges.some(existingCollege =>
          existingCollege.name.toLowerCase() === this.college.name.toLowerCase() && existingCollege._id != this.college._id)) {
            this.invalidErrorMessage('existing college');
          } else {
            if (this.college.abbreviation.trim().length > 0) {
              if (collegeTarget.abbreviation != this.college.abbreviation) {
                this.collegesService.updateCollege(this.college).subscribe( updatedCollege => {
                  const index = this.colleges.findIndex(oldCollege => oldCollege._id === updatedCollege._id);
                  this.colleges[index] = updatedCollege;
                  this.college = new College();
                  this.modal.close();
                });
              } else {
                this.invalidErrorMessage('update abbreviation')
              }
            } else {
              this.invalidErrorMessage('empty abbreviation')
            }
          }
        } else {
          this.invalidErrorMessage('empty college')
        }
    }
  }

  arraysEqual(a: any[] , b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    a.sort();
    b.sort();

    for (var i = 0; i < a.length; ++i) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  submitDepartment() {
    if (typeof(this.department.name) != undefined && this.department.name.trim().length > 0) {
      if (typeof(this.department.abbreviation) != undefined && this.department.abbreviation.trim().length > 0) {
        if (typeof(this.department.college) != undefined && typeof(this.department.college._id) != undefined) {
          this.departmentService.addDepartment(this.department).subscribe(
            data => {
              this.departments.push(data);
              this.departments = this.departments.slice(0);
            }
          );
          this.department = new Department();
        } else {
          this.invalidErrorMessage('empty college');
        }
      } else {
        this.invalidErrorMessage('empty abbreviation');
      }
    } else {
      this.invalidErrorMessage('empty department');
    }
  }

  /* Give a group's member list of IDs and return their corresponding member objects */
  getDeansObject(deanList: any[]): any[] {
    const displayList = [];

    for (let i = 0; i < deanList.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (deanList[i] === this.users[j]._id) {
          displayList.push(this.users[j]);
        }
      }
    }
    return displayList;
  }

  /* Function that returns a list of suggested users based on user's current field input */
  getSuggestedUsers(username: string, users: any[]): any[] {
    const filtered = [];
    const currentDeans = this.getDeansObject(this.college.deans);

    /* Push matching usernames to filtered list */
    for (let i = 0; i < users.length; i ++) {
      if ((users[i].username).toLowerCase().indexOf(username.toLowerCase()) === 0) {
        filtered.push(users[i].username);
      }
    }

    /* Filter out members that are already part of the group */
    for (let i = 0; i < currentDeans.length; i++) {
      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === currentDeans[i].username) {
          filtered.splice(j, 1);
        }
      }
    }
    /* Filter out usernames that were previously selected (but not added to the group) */
    for (let i = 0; i < this.suggestedUsers.length; i++) {
      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === this.suggestedUsers[i].name) {
          filtered.splice(j, 1);
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
