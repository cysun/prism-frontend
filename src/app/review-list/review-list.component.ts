import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';

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
  reviews: Review[] = [];
  currentReview: Review;

  colleges: College[];
  departments: Department[];
  programs: Program[];

  lookupCollege: (id: string) => College;
  lookupDepartment: (id: string) => Department;
  lookupProgram: (id: string) => Program;

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
    // Remember to set selectedOption
    Observable.forkJoin(
      this.reviewService.getReviews(),
      this.collegeService.getColleges(),
      this.departmentService.getDepartments(),
      this.programService.getPrograms()
    ).subscribe(data => {
      this.colleges = data[1];
      this.departments = data[2];
      this.programs = data[3];

      if (this.programs.length > 0) {
        this.selectedOption = this.programs[0]._id;
      }

      this.setUpHierarchyLookups();

      this.reviews = data[0];
      this.populateReviews();

      let filterFunction: (review: Review) => boolean;
      switch (this.reviewFilter) {
        case 'archive':
          filterFunction = review => {
            return !review.deleted && this.compareDate(review.finishDate);
          };
          break;
        case 'deleted':
          filterFunction = review => {
            return review.deleted;
          };
          break;
        default:
          filterFunction = review => {
            return !review.deleted && !this.compareDate(review.finishDate);
          };
      }
      this.reviews = this.reviews.filter(filterFunction);
      this.calculatePercentages();
    });
  }

  calculatePercentages(): void {
    this.reviews.forEach(review => {
      review.percentComplete = this.percentComplete(review);
    });
  };

  setUpHierarchyLookups(): void {
    const collegeLookupTable: { [key: string]: College; } = {};
    for (const college of this.colleges) {
      collegeLookupTable[college._id] = college;
    }
    this.lookupCollege = id => collegeLookupTable[id];

    const departmentLookupTable: { [key: string]: Department; } = {};
    for (const department of this.departments) {
      departmentLookupTable[department._id] = department;
      department.college = this.lookupCollege(<string> department.college);
    }
    this.lookupDepartment = id => departmentLookupTable[id];

    const programLookupTable: { [key: string]: Program; } = {};
    for (const program of this.programs) {
      programLookupTable[program._id] = program;
      program.department = this.lookupDepartment(<string> program.department);
    }
    this.lookupProgram = id => programLookupTable[id];
  }

  populateReviews(): void {
    for (const review of this.reviews) {
      if (review.program && !(review.program instanceof Program)) {
        review.program = this.lookupProgram(<string> review.program);
      }
    }
  }

  restoreReview(reviewId: string) {
    this.reviewService.restoreReview(reviewId).subscribe(() => {
      const index: number = this.reviews.findIndex(review => review._id === reviewId);
      this.reviews[index].deleted = false;
      this.reviews.splice(index, 1);
    });
  }

  addLeadReviewers(reviewId: string, leadReviewers: string[]) {
    const body = { leadReviewers: leadReviewers };
    this.reviewService.patchReview(reviewId, body).subscribe( data => {
      this.reviewService.getReview(reviewId).subscribe(patchedReview => {
        const index: number = this.reviews.findIndex(review => review._id === reviewId);
        this.reviews[index] = patchedReview;
        this.calculatePercentages();
        // Needed to repopulate patched review (for department and college)
        this.reviews[index].program = this.lookupProgram((<Program> this.reviews[index].program)._id);
      });
    }, (err) => {
      console.log(err);
    })
  }

  editLeadReviewers(reviewId: string, programId: string, leadReviewers: User[]) {
    let chosenReviewers = this.sharedService.filteredUsers;
    const currentReviewers = leadReviewers.map( reviewer => reviewer._id);

    if (chosenReviewers && chosenReviewers.length > 0) {
      chosenReviewers = chosenReviewers.concat(currentReviewers);
      this.addLeadReviewers(reviewId, chosenReviewers);
    }
    this.closeModal();
  }

  deleteLeadReviewer(userId: string) {
     const leadReviewers: User[] = <User[]> this.currentReview.leadReviewers;

     if (leadReviewers.length > 1) {
       const removeLeadReviewer = leadReviewers.findIndex( user => user._id === userId);
       leadReviewers.splice(removeLeadReviewer, 1);

       this.currentReview.leadReviewers = leadReviewers;

       const editLeadReviewerId = this.reviews.findIndex(review => review._id === this.currentReview._id);
       this.reviews[editLeadReviewerId].leadReviewers = this.currentReview.leadReviewers;

       const ids = leadReviewers.map( user => user._id);
       this.addLeadReviewers(this.currentReview._id, ids);
     } else {
       this.alert = { message: 'Please allow at least one lead reviewer.' };
     }
  }

  yearString(startDate: Date) {
    const startYear: number = (new Date(startDate)).getFullYear();
    return startYear + '-' + (startYear + 1);
  }

  submitReview() {
    const leadReviewers = this.sharedService.filteredUsers;

    if (leadReviewers) {
      this.reviewService.createReview(this.selectedOption).subscribe( data => {
        this.reviewService.getReview(data._id).subscribe(newReview => {
          this.reviews.push(newReview);
          this.calculatePercentages();
          this.populateReviews();
        });
      });
    } else {
      this.alert = { message: 'Please select at least one lead reviewer.' };
    }
  }

  deleteReview() {
    this.reviewService.deleteReview(this.currentReview._id).subscribe( () => {
      this.currentReview.deleted = true;
      this.reviews.splice(this.reviews.indexOf(this.currentReview), 1);
      this.closeModal();
    });
  }

  openModal(content, reviewId?: string) {
    this.currentReview = this.reviews.find(review => review._id === reviewId);
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

  compareDate(reviewFinishDate: string) {
    const dateNow = new Date(Date.now());
    const compareDate = new Date(reviewFinishDate);

    /* Check if today's date is earlier than the review's finish date */
    if (dateNow < compareDate) { return false; }

    return true;
  }
}
