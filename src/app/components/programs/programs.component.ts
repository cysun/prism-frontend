import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { ProgramService } from '../../services/program.service';

import { Globals } from '../../shared/app.global';
import { Program } from '../../models/program.model';

@Component({
  selector: 'prism-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})

export class ProgramsComponent implements OnInit {
  @Input() departmentId: any;
  @Input() modal: NgbModalRef;
  reviews: string[] = [];
  dateModel: any = { year: '', month: '', day: ''};
  currentDepartment: string;
  editedProgramName: string;
  program: Program = new Program();
  programs: Program[] = [];
  newProgram: Program = new Program;
  nextReviewDate: object;
  editedProgram: string;
  alerts: IAlert[] = [];

  constructor(private globals: Globals,
              private programService: ProgramService,
              private router: Router) { }

  ngOnInit() {
    this.currentDepartment = this.departmentId;
    this.programService.getProgramsAt(this.currentDepartment).subscribe(data => {
      this.programs = data;
    });
    this.programService.getReviews().subscribe(data => {
      data.forEach(review => {
        this.reviews.push(<string>review.program);
      });
    });
  }

  addProgram() {
    this.alerts = [];
    this.newProgram.department = this.currentDepartment;
    if (typeof(this.newProgram.name) === 'undefined' || this.newProgram.name.trim().length === 0) {
      this.invalidErrorMessage('empty program')
    } else if (this.newProgram.name.length > this.globals.maxProgramNameLength) {
      this.invalidErrorMessage('invalid program');
    } else if (this.programs.find(item => item.name.toLowerCase() === this.newProgram.name.trim().toLowerCase())) {
        this.invalidErrorMessage('existing program');
      } else if (!this.nextReviewDate) {
          this.invalidErrorMessage('empty date');
        } else {
          this.programService.addProgram(this.newProgram, this.nextReviewDate).subscribe( data => {
            this.programs.push(data);
          });
          this.newProgram = new Program();
        }
    }

  cancelUpdate() {
    this.program.name = this.editedProgramName;
    this.dateModel = { year: '', month: '', day: ''}
    this.editedProgram = '';
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  closeModal() {
    this.alerts = [];
    this.modal.close();
  }

  deleteProgram(program) {
    this.programService.deleteProgram(program._id).subscribe(() => {
      const index = this.programs.indexOf(program);
      this.programs.splice(index, 1);
    }, (err) => {
      console.log(err);
      this.invalidErrorMessage('pending review');
    });
    this.program = new Program();
  }

  editProgram(program) {
    this.editedProgram = program._id;
    this.editedProgramName = program.name;
    const dateObj = new Date(program.nextReviewDate);
    this.dateModel.year = dateObj.getFullYear();
    this.dateModel.month = dateObj.getMonth() + 1;
    this.dateModel.day = dateObj.getDate();
    this.program = program;
  }

  isReviewed(programId: string) {
    return this.reviews.indexOf(programId) >= 0;
  }

  updateProgram() {
    this.alerts = [];
    if (this.program.name.trim().length === 0) {
      this.invalidErrorMessage('empty program');
    } else if (this.program.name.length > this.globals.maxProgramNameLength) {
      this.invalidErrorMessage('invalid program');
    } else if (this.programs.some(existingProgram =>
        existingProgram.name.toLowerCase() === this.program.name.toLowerCase() && existingProgram._id !== this.program._id)) {
          this.invalidErrorMessage('existing program');
    } else {
        const newDate = this.dateModel.month + '/' + this.dateModel.day + '/' + this.dateModel.year;
        this.program.nextReviewDate = newDate;
        this.programService.updateProgram(this.program).subscribe( updatedProgram => {
          const index = this.programs.findIndex(item => item._id === this.program._id);
          this.programs[index] = updatedProgram;
          this.program = updatedProgram;
          this.editedProgram = '';
          this.dateModel = {year: '', month: '', day: ''};
        });
      }
  }

  invalidErrorMessage(message) {
    this.alerts = [];
    let detailMsg = '';

    switch (message) {
      case 'invalid program':
        detailMsg = `Length of program\'s name must be ${this.globals.maxProgramNameLength} or less characters.`;
        break;
      case 'empty program':
        detailMsg = 'Please input a program name.';
        break;
      case 'existing program':
        detailMsg = 'Name of program already exists.'
        break;
      case 'empty date':
        detailMsg = 'Please input the next date the program must be reviewed.';
        break;
      case 'pending review':
        detailMsg = 'The deletion of a program under review cannot be done.'
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

}

export interface IAlert {
  type: string;
  message: string;
}
