import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { NgbModule, NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ProgramsComponent } from './programs/programs.component';

import { DepartmentService } from './department.service';
import { ProgramService } from './programs/program.service';

import { User } from '../../models/user.model';
import { Department } from '../../models/department.model'
import { College } from '../../models/college.model';
import { Program } from '../../models/program.model';

@Component({
  selector: 'prism-departments',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  @ViewChild(ProgramsComponent)
  @Input() collegeId: any;
  currentCollege: string;
  programsComponent: ProgramsComponent;
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };
  suggestedUsers: User[] = [];
  filteredChairs: User[] = [];
  department: Department = new Department();
  departments: Department[] = [];
  chair: User = new User();
  chairs: User[] = [];
  programs: Program[] = [];
  users: User[] = [];
  alerts: IAlert[] = [];
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.getSuggestedUsers(term, this.users));

  constructor(private departmentService: DepartmentService,
              private programService: ProgramService,
              private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.departmentService.getDepartmentsAt(this.collegeId).subscribe(data => {
      this.departments = data;
    });
    this.currentCollege = this.collegeId;
    this.departmentService.getUsers().subscribe( data => {
      this.users = data;
    });
  }

  addChair() {
    if (typeof(this.chair.username) !== 'undefined' && this.chair.username.trim().length > 0) {
      const userObj = this.users.find(item => item.username === this.chair.username);
      this.chairs.push(userObj);
      const chairIds = this.chairs.map(chair => chair._id);
      this.department.chairs = chairIds;
      this.departmentService.updateDepartment(this.department).subscribe( updatedDepartment => {
        const index = this.departments.findIndex(oldDepartment => oldDepartment._id === updatedDepartment._id);
        this.departments[index] = updatedDepartment;
      });
      this.chair = new User();
    }
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

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  closeModal() {
    this.modal.close();
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

  deleteDepartment() {
    this.departmentService.deleteDepartment(this.department._id).subscribe(() => {
      const index = this.departments.indexOf(this.department);
      this.departments.splice(index, 1);
      this.departments = this.departments.slice(0);
    });
    this.department = new Department();
    this.closeModal();
  }

  deleteDepartmentDialog(content, department) {
    this.programService.getProgramsAt(department._id).subscribe(data => {
      this.programs = data;
    })
    this.department = department;
    this.modal = this.modalService.open(content, this.options);
  }

  deleteChair(chair) {
    this.alerts = [];
    this.alerts.push({type: 'warning', message: `${chair.username} was removed from the chairs list`});
    const index = this.chairs.indexOf(chair);
    this.chairs.splice(index, 1);
    const chairIds = this.chairs.map(chairUser => chairUser._id);
    this.department.chairs = chairIds;
    this.departmentService.updateDepartment(this.department).subscribe( updatedDepartment => {
      const idx = this.departments.findIndex(oldDepartment => oldDepartment._id === updatedDepartment._id);
      this.departments[idx] = updatedDepartment;
    });
  }

  /* Give a chair's member list of IDs and return their corresponding member objects */
  getChairsObject(chairList: any[]): any[] {
    const displayList = [];

    for (let i = 0; i < chairList.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (chairList[i]._id === this.users[j]._id) {
          displayList.push(this.users[j]);
        }
      }
    }
    return displayList;
  }

  getDepartmentsAt(collegeId) {
    this.departmentService.getDepartmentsAt(collegeId).subscribe( data => {
      this.departments = data;
    });
  }

  /* Function that returns a list of suggested users based on user's current field input */
  getSuggestedUsers(username: string, users: any[]): any[] {
    const filtered = [];
    const currentChairs = this.getChairsObject(this.department.chairs);

    /* Push matching usernames to filtered list */
    for (let i = 0; i < users.length; i ++) {
      if ((users[i].username).toLowerCase().indexOf(username.toLowerCase()) === 0) {
        filtered.push(users[i].username);
      }
    }

    /* Filter out members that are already part of the deans */
    for (let i = 0; i < currentChairs.length; i++) {
      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === currentChairs[i].username) {
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

  invalidErrorMessage(message) {
    this.alerts = [];
    let detailMsg = '';

    switch (message) {
      case 'empty department':
        detailMsg = 'Please input a department name.';
        break;
      case 'empty abbreviation':
        detailMsg = 'Please input an abbreviation.';
        break;
      case 'existing department':
        detailMsg = 'Name of department already exists.'
        break;
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

  manageDepartmentDialog(content, departmentId: string) {
    this.alerts = [];
    this.departmentService.getDepartment(departmentId).subscribe( data => {
      this.department = data;
      this.department.chairs = this.getChairsObject(data.chairs);
      this.chairs = <User[]> this.department.chairs;
    });
    this.modal = this.modalService.open(content, this.options);
  }

  openModal(content) {
    this.modal = this.modalService.open(content, this.options);
  }

  submitDepartment() {
    this.alerts = [];
    this.department.college = this.currentCollege;
    if (typeof(this.department.name) !== 'undefined' && this.department.name.trim().length > 0) {
      if (typeof(this.department.abbreviation) !== 'undefined' && this.department.abbreviation.trim().length > 0) {
        if (this.departments.find(item => item.name === this.department.name)) {
          this.invalidErrorMessage('existing department');
        } else {
          this.departmentService.addDepartment(this.department).subscribe(
            data => {
              this.departments.push(data);
              this.departments = this.departments.slice(0);
            }
          );
          this.department = new Department();
          this.closeModal();
        }
      } else {
          this.invalidErrorMessage('empty abbreviation');
        }
    } else {
      this.invalidErrorMessage('empty department');
    }
  }

  updateDepartment() {
    this.alerts = [];
    const departmentTarget = this.departments.find(item => item._id === this.department._id);
    const changed = departmentTarget.name !== this.department.name ||
      departmentTarget.abbreviation !== this.department.abbreviation ||
      !this.arraysEqual(departmentTarget.chairs, this.department.chairs) ? true : false;

    if (changed) {
      if (this.department.name.trim().length > 0) {
        if (this.departments.some(existingDepartment =>
          existingDepartment.name.toLowerCase() === this.department.name.toLowerCase() && existingDepartment._id !== this.department._id)) {
            this.invalidErrorMessage('existing department');
          } else {
            if (this.department.abbreviation.trim().length > 0) {
              this.departmentService.updateDepartment(this.department).subscribe( updatedDepartment => {
                const index = this.departments.findIndex(oldDepartment => oldDepartment._id === updatedDepartment._id);
                this.departments[index] = updatedDepartment;
                this.department = new Department();
                this.modal.close();
              });
            } else {
              this.invalidErrorMessage('empty abbreviation')
            }
          }
        } else {
          this.invalidErrorMessage('empty department')
        }
    } else {
      this.modal.close();
    }
  }

  viewChairsDialog(content, department: any) {
    this.chairs = department.chairs;
    this.departmentService.getDepartment(department._id).subscribe( data => {
      this.department = data;
      this.department.chairs = this.getChairsObject(data.chairs);
      this.chairs = <User[]> this.department.chairs;
    });
    this.modal = this.modalService.open(content, this.options);
  }

}

export interface IAlert {
  type: string;
  message: string;
}