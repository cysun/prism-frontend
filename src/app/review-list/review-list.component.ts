import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { College } from '../models/college.model';
import { Department } from '../models/department.model';
import { Globals } from '../shared/app.global';
import { Program } from '../models/program.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';

import { CollegesService } from '../colleges/colleges.service';
import { DepartmentService } from '../colleges/departments/department.service';
import { GroupManagerService } from '../group-manager/group-manager.service';
import { ProgramService } from '../colleges/departments/programs/program.service';
import { ReviewService } from '../review/review.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'prism-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  modal: NgbModalRef;
  reviewsList: Review[] = [];

  programsList: Program[] = [];
  selectedOption: string;
  suggestedUsers: string[];

  alert: any;

  constructor(private collegeService: CollegesService,
              private departmentService: DepartmentService,
              private globals: Globals,
              private groupManagerService: GroupManagerService,
              private modalService: NgbModal,
              private programService: ProgramService,
              private reviewService: ReviewService,
              private sharedService: SharedService) { }

  ngOnInit() {

    this.programService.getPrograms().subscribe( data => {
      this.programsList = data;
      this.selectedOption = this.programsList[0]._id;
    })

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
          }).then(() => {
            const dept: Department = JSON.parse(JSON.stringify(program.department));

            this.getCollegeData(dept.college).then((data: College) => {
              const college: College = data;
              dept.college = JSON.parse(JSON.stringify(college));
              program.department = JSON.parse(JSON.stringify(dept));
              this.reviewsList[i].program = JSON.parse(JSON.stringify(program));
            })
          })
        }).then(() => {
          const leadReviewers: User[] = [];
          for (let j = 0; j < this.reviewsList[i].leadReviewers.length; j++) {
            this.getLeadReviewerData(this.reviewsList[i].leadReviewers[j])
            .then( (data: User) => {
              leadReviewers.push(data);
              this.reviewsList[i].leadReviewers = JSON.parse(JSON.stringify(leadReviewers));
            })
          }
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

  getLeadReviewerData(userId: string) {
    return new Promise((resolve, reject) => {
      this.groupManagerService.getUser(userId).subscribe( (data: User) => {
        resolve(data);
      });
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

  getCollegeData(collegeId: string) {
    return new Promise((resolve, reject) => {
      this.collegeService.getCollege(collegeId).subscribe( data => {
        resolve(data);
      });
    });
  }

  yearString(startDate: Date) {
    const startYear: number = (new Date(startDate)).getFullYear();
    return startYear + '-' + (startYear + 1);
  }


  submitReview() {
    const leadReviewers = this.sharedService.filteredUsers;

    if (leadReviewers) {
      this.createReview().then( (data: Review) => {
        this.addLeadReviewers(data._id, data.program, leadReviewers);
      })
      this.alert = '';
      this.closeModal();
    } else {
      this.alert = { message: 'Please select at least one lead reviewer.' };
    }
  }

  createReview() {
    return new Promise((resolve, reject) => {
      this.reviewService.createReview(this.selectedOption).subscribe( data => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject();
      });
    });
  }

  addLeadReviewers(reviewId: string, programId: string, leadReviewers: string[]) {
    const body = { program: programId, leadReviewers: leadReviewers };
    this.reviewService.patchReview(reviewId, body).subscribe( data => {
    }, (err) => {
      console.log(err);
    })
  }

  openModal(content) {
    this.modal = this.modalService.open(content, this.globals.options);
  }

  closeModal() {
    this.alert = '';
    this.modal.close();
  }
}
