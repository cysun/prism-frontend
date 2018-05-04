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
  alert: any;
  suggestionFilter: (user: User) => boolean;
  // Angular Bootstrap date output
  newDate: any;
  // Angular Bootstrap minimum allowed date
  minDate = {
    year: 1947,
    month: 1,
    day: 1
  };
  filterPrograms = true;

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
      this.programs = data[3].sort((program1, program2) => {
        if (program1.name < program2.name) {
          return -1;
        }
        if (program2.name < program1.name) {
          return 1;
        }
        return 0;
      });

      this.setUpHierarchyLookups();

      this.reviews = data[0];
      this.populateReviews();

      const storedUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId: string = storedUser.user._id;

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
        case 'my':
          filterFunction = review => {
            return (<User[]> review.leadReviewers).findIndex(user => user._id === userId) !== -1;
          };
          break;
        default:
          filterFunction = review => {
            return !review.deleted && !this.compareDate(review.finishDate);
          };
      }
      this.reviews = this.reviews.filter(filterFunction);

      let userFilter: (review: Review) => boolean;
      if (storedUser.groups.find(group => group.name === 'Administrators' || group.name === 'Program Review Subcommittee')) {
        userFilter = review => true;
      } else if (storedUser.groups.find(group => group.name === 'University')) {
        userFilter = review => {
          const department: Department = <Department> (<Program> review.program).department;
          const college: College = <College> department.college;
          return (<User[]> department.chairs).findIndex(chair => chair._id === userId) !== -1
                 || (<User[]> college.deans).findIndex(dean => dean._id === userId) !== -1
        };
      } else {
        userFilter = review => true;
      }
      this.reviews = this.reviews.filter(userFilter);

      this.calculatePercentages();
    });
  }

  updateSelected(): void {
    this.filterPrograms = !this.filterPrograms;
    if (this.programs.length === 0) {
      return;
    }
    this.selectedOption = this.programs[0]._id;
  }

  programReviewPendingFilter(program: Program): boolean {
    // If we are within 6 months of the review date, keep this program
    return 15552000000 > Math.abs((new Date(program.nextReviewDate)).getTime() - (new Date()).getTime());
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
    const currentReviewers = leadReviewers.map(reviewer => reviewer._id);

    if (chosenReviewers && chosenReviewers.length > 0) {
      chosenReviewers = chosenReviewers.concat(currentReviewers);
      this.addLeadReviewers(reviewId, chosenReviewers);
    }
    this.closeModal();
  }

  deleteLeadReviewer(userId: string) {
     const leadReviewers: User[] = <User[]> this.currentReview.leadReviewers;

     if (leadReviewers.length > 1) {
       const indexToRemove = leadReviewers.findIndex(user => user._id === userId);
       leadReviewers.splice(indexToRemove, 1);

       this.addLeadReviewers(this.currentReview._id, leadReviewers.map(reviewer => reviewer._id));
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

    const startDate = `${this.newDate.year}-${this.newDate.month}-${this.newDate.day}`;
    this.reviewService.createReview(this.selectedOption, startDate).subscribe(data => {
      this.reviews.push(data);
      this.addLeadReviewers(data._id, leadReviewers);
      this.closeModal();
    });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.currentReview._id).subscribe(() => {
      this.currentReview.deleted = true;
      this.reviews.splice(this.reviews.indexOf(this.currentReview), 1);
      this.closeModal();
    });
  }

  openModal(content, reviewId?: string) {
    const now: Date = new Date();
    this.newDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };
    this.currentReview = this.reviews.find(review => review._id === reviewId);
    this.suggestionFilter = (prsMember) => {
      return (<User[]> this.currentReview.leadReviewers).findIndex(reviewer => {
        return reviewer._id === prsMember._id;
      }) === -1;
    };
    this.modal = this.modalService.open(content, this.globals.options);
    this.updateSelected();
  }

  closeModal() {
    this.alert = '';
    this.currentReview = new Review();
    this.sharedService.filteredUsers = [];
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
