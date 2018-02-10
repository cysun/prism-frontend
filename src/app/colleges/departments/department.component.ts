import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DepartmentService } from './department.service';

import { Department } from '../../models/department.model'
import { College } from '../../models/college.model';

@Component({
  selector: 'departments',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  @Input() collegeId: string;
  department: Department = new Department();
  departments: Department[] = [];
  alerts: IAlert[] = [];

  constructor(private departmentService: DepartmentService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    // this.departmentService.getDepartmentsAt(this.collegeId).subscribe(data => {
    //   this.departments = data;
    //   console.log(data);
    // });
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
      case 'empty college':
        detailMsg = 'Please select a college.';
        break;
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

  getDepartmentsAt(collegeId) {
    this.departmentService.getDepartmentsAt(collegeId).subscribe( data => {
      this.departments = data;
      console.log(data);
    })
  }
}

export interface IAlert {
  type: string;
  message: string;
}
