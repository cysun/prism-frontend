import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { ProgramService } from './program.service';

import { Department } from '../../../models/department.model'
import { Program } from '../../../models/program.model';

@Component({
  selector: 'prism-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})

export class ProgramsComponent implements OnInit {
  @Input() departmentId: any;
  @Input() modal: NgbModalRef;
  dateModel: any = { year: '', month: '', day: ''};
  currentDepartment: string;
  editedProgramName: string;
  program: Program = new Program();
  programs: Program[] = [];
  newProgram: Program = new Program;
  nextReviewDate: object;
  editedProgram: string;
  alerts: IAlert[] = [];

  constructor(private programService: ProgramService, private router: Router) { }

  ngOnInit() {
    this.currentDepartment = this.departmentId;
    this.programService.getProgramsAt(this.currentDepartment).subscribe(data => {
      this.programs = data;
      console.log(data);
    });
  }

  addProgram() {
    this.alerts = [];
    this.newProgram.department = this.currentDepartment;
    if (typeof(this.newProgram.name) === 'undefined' || this.newProgram.name.trim().length === 0) {
      this.invalidErrorMessage('empty program')
    } else if (this.programs.find(item => item.name.toLowerCase() === this.newProgram.name.trim().toLowerCase())) {
        this.invalidErrorMessage('existing program');
      } else if (!this.nextReviewDate) {
          this.invalidErrorMessage('empty date');
        } else {
          this.programService.addProgram(this.newProgram, this.nextReviewDate).subscribe( data => {
            this.programs.push(data);
            this.programs = this.programs.slice(0);
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
    this.modal.close();
  }

  deleteProgram(program) {
    console.log(program._id);
    this.programService.deleteProgram(program._id).subscribe(() => {
      const index = this.programs.indexOf(program);
      this.programs.splice(index, 1);
      this.programs = this.programs.slice(0);
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

  updateProgram() {
    this.alerts = [];
    if (this.program.name.trim().length === 0) {
      this.invalidErrorMessage('empty program');
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
          console.log('updated successfully');
        });
      }
  }

  invalidErrorMessage(message) {
    this.alerts = [];
    let detailMsg = '';

    switch (message) {
      case 'empty program':
        detailMsg = 'Please input a program name.';
        break;
      case 'existing program':
        detailMsg = 'Name of program already exists.'
        break;
      case 'empty date':
        detailMsg = 'Please input the next date the program must be reviewed';
        break;
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

}

export interface IAlert {
  type: string;
  message: string;
}
