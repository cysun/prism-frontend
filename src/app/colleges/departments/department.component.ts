import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModule, NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { DepartmentService } from './department.service';

import { User } from '../../models/user.model';
import { Department } from '../../models/department.model'
import { College } from '../../models/college.model';

@Component({
  selector: 'prism-departments',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  @Input() collegeId: any;
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };
  suggestedUsers: User[] = [];
  filteredDeans: User[] = [];
  department: Department = new Department();
  departments: Department[] = [];
  alerts: IAlert[] = [];

  constructor(private departmentService: DepartmentService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.departmentService.getDepartmentsAt(this.collegeId).subscribe(data => {
      this.departments = data;
      console.log(data);
    });
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

  openModal(content) {
    this.modalService.open(content, this.options)
  }
  closeModal() {
    this.modal.close();
  }
  //
  // // deleteDepartmentModal(content, id){
  // //   this.alerts = [];
  // //   this.deleteCollege(id);
  // //   this.modal = this.modalService.open(content, this.options);
  // // }
  //
  submitDepartment() {
    this.alerts = [];
    this.department.college = this.collegeId;
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

  getDepartmentsAt(collegeId) {
    this.departmentService.getDepartmentsAt(collegeId).subscribe( data => {
      this.departments = data;
    })
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
export interface IAlert {
  type: string;
  message: string;
}
