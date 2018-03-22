import { Component, OnInit } from '@angular/core';

import { Department } from '../models/department.model';
import { Program } from '../models/program.model';
import { Review } from '../models/review.model';

import { DepartmentService } from '../colleges/departments/department.service';
import { ProgramService } from '../colleges/departments/programs/program.service';
import { ReviewService } from '../review/review.service';


@Component({
  selector: 'prism-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviewsList: Review[] = [];

  constructor(private departmentService: DepartmentService,
    private programService: ProgramService,
    private reviewService: ReviewService) { }

  ngOnInit() {
    this.getAllReviews().then ( () => {
      for (let i = 0; i < this.reviewsList.length; i++) {
        this.getProgramData(this.reviewsList[i].program).then( (data: Program) => {
          this.reviewsList[i].program = JSON.parse(JSON.stringify(data));
        }).then (() => {
          const program: Program = JSON.parse(JSON.stringify(this.reviewsList[i].program));

          this.getDepartmentData(program.department).then( (data: Department) => {
            const dept: Department = data;
            program.department = JSON.parse(JSON.stringify(dept));
            this.reviewsList[i].program = JSON.parse(JSON.stringify(program));
          })
        })
      }
    })
  }

  getAllReviews() {
    return new Promise((resolve, reject) => {
      this.reviewService.getReviews().subscribe( data => {
        this.reviewsList = data;
        resolve();
      })
    });
  }

  getProgramData(programId: string) {
    return new Promise((resolve, reject) => {
      this.programService.getProgram(programId).subscribe( (data: Program) => {
        resolve(data);
      });
    });
  }

  getDepartmentData(departmentId: string) {
    return new Promise((resolve, reject) => {
      this.departmentService.getDepartment(departmentId).subscribe( data => {
        resolve(data);
      });
    });
  }
  }
