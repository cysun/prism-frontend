import { Component, Input, OnInit } from '@angular/core';
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
  @Input() reviewFilter: string;

  modal: NgbModalRef;
  reviewsList: Review[] = [];
  currentReview: Review;

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

      if (this.programsList && this.programsList.length > 0) {
        this.selectedOption = this.programsList[0]._id;
      }
    })

    this.getAllReviews().then ( () => {
      for (let i = 0; i < this.reviewsList.length; i++) {
          this.reviewsList[i].percentComplete = this.percentComplete(this.reviewsList[i]);
          this.getProgramData().then( (data: Program[]) => {
            const matchingProgramIndex = data.findIndex(x => x._id === this.reviewsList[i].program);
            this.reviewsList[i].program = JSON.parse(JSON.stringify(data[matchingProgramIndex]));
          })
          .then( () => {
            const currentProgram: Program = JSON.parse(JSON.stringify(this.reviewsList[i].program));
            this.getDepartmentData().then( (data: Department[]) => {
              const matchingDepartmentIndex = data.findIndex( x => x._id === currentProgram.department);
              currentProgram.department = JSON.parse(JSON.stringify(data[matchingDepartmentIndex]));
            })
            .then( () => {
              this.getCollegeData().then( (data: College[]) => {
                const currentDepartment: Department = JSON.parse(JSON.stringify(currentProgram.department));
                const matchingCollegeIndex = data.findIndex(x => x._id === currentDepartment.college);
                currentDepartment.college = JSON.parse(JSON.stringify(data[matchingCollegeIndex]));
                currentProgram.department = JSON.parse(JSON.stringify(currentDepartment));
                this.reviewsList[i].program = JSON.parse(JSON.stringify(currentProgram));
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

  restoreReview(reviewId: string) {
    this.reviewService.restoreReview(reviewId).subscribe(() => {
      this.programsList = [];
      this.reviewsList = [];
      this.ngOnInit();
    });
  }

  addLeadReviewers(reviewId: string, programId: string, leadReviewers: string[]) {
    const body = { program: programId, leadReviewers: leadReviewers };
    this.reviewService.patchReview(reviewId, body).subscribe( data => {

      const leadReviewersData: User[] = [];
      const findReviewId = this.reviewsList.findIndex( x => x._id === reviewId);

      for (let i = 0; i < data.leadReviewers.length; i++) {
        this.getLeadReviewerData(data.leadReviewers[i]).then( (user: User) => {
          leadReviewersData.push(user);
          this.reviewsList[findReviewId].leadReviewers = JSON.parse(JSON.stringify(leadReviewersData));
        })
      }
    }, (err) => {
      console.log(err);
    })
  }

  editLeadReviewers(reviewId: string, programId: string, leadReviewers: User[]) {
    let chosenReviewers = this.sharedService.filteredUsers;
    const currentReviewers = leadReviewers.map( reviewer => reviewer._id);

    if (chosenReviewers && chosenReviewers.length > 0) {
      chosenReviewers = chosenReviewers.concat(currentReviewers);
      this.addLeadReviewers(reviewId, programId, chosenReviewers);
    }
    this.closeModal();
  }

  deleteLeadReviewer(userId: string) {
     const leadReviewers: User[] = JSON.parse(JSON.stringify(this.currentReview.leadReviewers));

     if (leadReviewers.length > 1) {
       const removeLeadReviewer = leadReviewers.findIndex( user => user._id === userId);
       leadReviewers.splice(removeLeadReviewer, 1);

       this.currentReview.leadReviewers = JSON.parse(JSON.stringify(leadReviewers));

       const editLeadReviewerId = this.reviewsList.findIndex(review => review._id === this.currentReview._id);
       this.reviewsList[editLeadReviewerId].leadReviewers = this.currentReview.leadReviewers;

       const ids = leadReviewers.map( user => user._id);
       this.addLeadReviewers(this.currentReview._id, this.currentReview.program, ids);
     } else {
       this.alert = { message: 'Please allow at least one lead reviewer.' };
     }
  }

  getAllReviews() {
    if (this.reviewFilter === 'archive') {
      return new Promise((resolve, reject) => {
        this.reviewService.getReviews().subscribe( data => {
          for (let i = 0; i < data.length; i++) {
            if (!data[i].deleted && this.comparingDates(data[i].finishDate)) {
              this.reviewsList.push(data[i]);
            }
          }
          resolve();
        })
      });
    } else if (this.reviewFilter === 'deleted') {
      return new Promise((resolve, reject) => {
        this.reviewService.getReviews().subscribe(data => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].deleted) {
              this.reviewsList.push(data[i]);
            }
          }
          resolve();
        });
      });
    }

    return new Promise((resolve, reject) => {
      this.reviewService.getReviews().subscribe( data => {
        for (let i = 0; i < data.length; i++) {
          if (!data[i].deleted && (!this.comparingDates(data[i].finishDate))) {
            this.reviewsList.push(data[i]);
          }
        }
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

  getProgramData(programId?: string) {
    if (programId) {
      return new Promise((resolve, reject) => {
        this.programService.getProgram(programId).subscribe( (data: Program) => {
          resolve(data);
        });
      });
    }
    return new Promise((resolve, reject) => {
      this.programService.getPrograms().subscribe( (data: Program[]) => {
        resolve(data);
      });
    });
  }

  getDepartmentData(departmentId?: string) {
    if (departmentId) {
      return new Promise((resolve, reject) => {
        this.departmentService.getDepartment(departmentId).subscribe( (data: Department) => {
          resolve(data);
        });
      });
    }
    return new Promise((resolve, reject) => {
      this.departmentService.getDepartments().subscribe( (data: Department[]) => {
        resolve(data);
      });
    });
  }

  getCollegeData(collegeId?: string) {
    if (collegeId) {
      return new Promise((resolve, reject) => {
        this.collegeService.getCollege(collegeId).subscribe( data => {
          resolve(data);
        });
      });
    }
    return new Promise((resolve, reject) => {
      this.collegeService.getColleges().subscribe( data => {
        resolve(data);
      });
    });
  }

  yearString(startDate: Date) {
    const startYear: number = (new Date(startDate)).getFullYear();
    return startYear + '-' + (startYear + 1);
  }

  getReviewData(review: Review) {
    return new Promise((resolve, reject) => {
      this.getProgramData(review.program).then ( (program: Program) =>
      review.program = JSON.parse(JSON.stringify(program))).then( () => {
        const currentProgram: Program = JSON.parse(JSON.stringify(review.program));

        this.getDepartmentData(currentProgram.department).then ( (department: Department) => {
          currentProgram.department = JSON.parse(JSON.stringify(department));
        }).then ( () => {
          const currentDepartment: Department = JSON.parse(JSON.stringify(currentProgram.department));
          this.getCollegeData(currentDepartment.college).then( (college: College) => {
            currentDepartment.college = JSON.parse(JSON.stringify(college));
            currentProgram.department = JSON.parse(JSON.stringify(currentDepartment));
            review.program = JSON.parse(JSON.stringify(currentProgram));
            this.reviewsList.push(review);

            resolve();
          });
        });
      });
    });
  }

  getReview(reviewId: string) {
    return new Promise((resolve, reject) => {
      this.reviewService.getReview(reviewId).subscribe( data => {
        this.currentReview = data;
        resolve(data);
      }, (err) => {
        console.log(err);
        reject();
      });
    });
  }

  submitReview() {
    const leadReviewers = this.sharedService.filteredUsers;

    if (leadReviewers) {
      this.reviewService.createReview(this.selectedOption).subscribe( data => {
        this.getReviewData(data).then( () => {
          this.addLeadReviewers(data._id, data.program, leadReviewers);
          this.sharedService.filteredUsers = null;
          this.alert = '';
          this.closeModal();
        });
      })
    } else {
      this.alert = { message: 'Please select at least one lead reviewer.' };
    }
  }

  createReview() {
    return new Promise((resolve, reject) => {
      this.reviewService.createReview(this.selectedOption).subscribe( (data: Review) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject();
      });
    });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.currentReview._id).subscribe( () => {
      const deleteReviewIndex = this.reviewsList.findIndex(review =>
        review._id === this.currentReview._id);

      this.reviewsList.splice(deleteReviewIndex, 1);
      this.closeModal();
    })
  }

  openModal(content, reviewId?: string) {
    if (reviewId) {
      this.sharedService.filteredUsers = null;

      this.getReview(reviewId).then( (data: Review) => {
        this.currentReview = data;
      }).then( () => {
        const leadReviewers: User[] = [];

        for (let i = 0; i < this.currentReview.leadReviewers.length; i++) {
          this.getLeadReviewerData(this.currentReview.leadReviewers[i])
          .then( (userData: User) => {
            leadReviewers.push(userData);
          }).then( () => {
            this.currentReview.leadReviewers = JSON.parse(JSON.stringify(leadReviewers));

            if (this.sharedService.prsMembersList) {
              const currentLeadReviewers: User[] =  JSON.parse(JSON.stringify(this.currentReview.leadReviewers));
              const originalPrsList: User[] = JSON.parse(JSON.stringify(this.sharedService.prsMembersList));

              for (let j = 0; j < originalPrsList.length; j++) {
                for (let k = 0; k < currentLeadReviewers.length; k++) {
                  if (originalPrsList[j]._id === currentLeadReviewers[k]._id) {
                    this.sharedService.prsMembersList.splice(j, 1);
                  }
                }
              }
              this.suggestedUsers = this.sharedService.prsMembersList;
            }
          })
        }
      })
    }
    this.modal = this.modalService.open(content, this.globals.options);
  }

  closeModal() {
    this.alert = '';
    this.currentReview = new Review();
    this.modal.close();
  }

  percentComplete(review: Review): number {
    let totalDaysPassed = 0;
    let totalDaysForCompletion = 0;
    for (const nodeId of Object.keys(review.nodes)) {
      if (review.nodes[nodeId].finalized) {
        totalDaysPassed += review.nodes[nodeId].completionEstimate;
      } else {
        const msPassed = ((new Date()).getTime() - (new Date(review.nodes[nodeId].startDate)).getTime());
        // 86400000ms in one day
        totalDaysPassed += (msPassed > 0 ? msPassed : 0) / 86400000;
      }
      totalDaysForCompletion += review.nodes[nodeId].completionEstimate;
    }
    return Math.floor(100 * totalDaysPassed / totalDaysForCompletion);
  }

  comparingDates(reviewFinishDate: string) {
    const dateNow = new Date(Date.now());
    const compareDate = new Date(reviewFinishDate);

    /* Check if today's date is earlier than the review's finish date */
    if (dateNow < compareDate) { return false; }

    return true;
  }
}
