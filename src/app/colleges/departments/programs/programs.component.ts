import { Component, OnInit, Input } from '@angular/core';
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
  @Input() department: any;
  program: Program = new Program();
  programs: Program[] = [];
  newProgram: Program = new Program;
  editedProgram: string;
  alerts: IAlert[] = [];

  constructor(private programService: ProgramService, private router: Router) { }

  ngOnInit() {
    this.programService.getProgramsAt(this.department._id).subscribe(data => {
      this.department.programs = data;
      this.programs = data;
      console.log(data);
    });
  }

  addProgram() {
    this.alerts = [];
    this.newProgram.department = this.department._id;
    if (typeof(this.newProgram.name) !== 'undefined' && this.newProgram.name.trim().length > 0) {
      if (this.programs.find(item => item.name.toLowerCase() === this.newProgram.name.trim().toLowerCase())) {
        this.invalidErrorMessage('existing program');
      } else {
        this.programService.addProgram(this.newProgram).subscribe( data => {
          this.programs.push(data);
          this.programs = this.programs.slice(0);
        });
        this.newProgram = new Program();
      }
    } else {
      this.invalidErrorMessage('empty program')
    }
  }

  cancelUpdate() {
    this.editedProgram = "";
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
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
    this.program = program;
  }

  updateProgram() {
    this.alerts = [];
    if (this.program.name.trim().length > 0) {
      if (this.programs.some(existingProgram =>
        existingProgram.name.toLowerCase() === this.program.name.toLowerCase() && existingProgram._id != this.program._id)) {
          this.invalidErrorMessage('existing program');
      } else {
        this.programService.updateProgram(this.program).subscribe( updatedProgram => {
          const index = this.programs.findIndex(item => item._id === this.program._id);
          this.programs[index] = updatedProgram;
          this.program = updatedProgram;
          this.editedProgram = "";
        });
      }
    } else {
      this.cancelUpdate();
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
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

}

export interface IAlert {
  type: string;
  message: string;
}
