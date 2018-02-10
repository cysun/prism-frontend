<<<<<<< HEAD
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CollegesService } from './colleges.service';
import { DepartmentService } from './departments/department.service';

import { User } from '../models/user.model';
import { College } from '../models/college.model';
import { Department } from '../models/department.model';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> master

@Component({
  selector: 'prism-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.css']
})
export class CollegesComponent implements OnInit {
<<<<<<< HEAD
  @Input()
  modal: NgbModalRef
  alerts: IAlert[] = [];
  department: Department = new Department();
  departments: Department[] = [];
  college: College = new College();
  colleges: College[] = [];
  users: User[] = [];
  dean: User = new User();

  filteredColleges: College[] = [];

  constructor(private collegesService: CollegesService, private departmentService: DepartmentService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.collegesService.getColleges().subscribe(data => {
      this.colleges = data;
      console.log(data);
    });
    this.collegesService.getUsers().subscribe( data => {
      this.users = data;
      console.log(data);
    })
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
        detailMsg = 'There are no departments';
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
    this.modal = this.modalService.open(content);
    this.college = new College();
  }

  deleteCollegeDialog(content, id){
    this.alerts = [];
    this.deleteCollege(id);
    this.modal = this.modalService.open(content);
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

    this.modal = this.modalService.open(content);
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
    if (this.college.name.trim().length > 0) {
      this.collegesService.updateCollege(this.college).subscribe( updatedCollege => {
        const index = this.colleges.findIndex(oldCollege => oldCollege._id === updatedCollege._id);
        this.colleges[index] = updatedCollege;
      });
      this.college = new College();
    } else {
      this.invalidErrorMessage('empty college');
    }
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
}

export interface IAlert {
  type: string;
  message: string;
=======

  constructor() { }

  ngOnInit() {
  }

>>>>>>> master
}
