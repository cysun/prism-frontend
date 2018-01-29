import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DepartmentService } from './department.service';

import { Department } from '../../models/department.model'
import { College } from '../../models/college.model';

import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  @Input() collegeId: string;
  departments: Department[] = [];
  constructor(private departmentService: DepartmentService, private router: Router) { }

  ngOnInit() {
    this.departmentService.getDepartments(this.collegeId).subscribe(data => {
      this.departments = data;
      console.log(data);
    });
  }

}
