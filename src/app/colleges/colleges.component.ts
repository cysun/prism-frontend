import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CollegesService } from './colleges.service';

import { College } from '../models/college.model';

@Component({
  selector: 'prism-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.css']
})

export class CollegesComponent implements OnInit {
  @Input();
  alerts: IAlert[] = [];
  displayDelete: Boolean = false;
  displayCollegeManager: Boolean = false;
  college: College = new College();
  colleges: College[] = [];
  filteredColleges: College[] = [];

  constructor(private collegesService: CollegesService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.collegesService.getColleges().subscribe(data => {
      this.colleges = data;
      console.log(data);
    });
  }

  invalidErrorMessage(message) {
    this.alerts = [];
    let detailMsg = '';

    switch (message) {
      case 'empty college':
        detailMsg = 'Please input a college name.';
        break;
      case 'empty abbreviation':
        detailMsg = 'Please input an abbreviation.';
        break;
    }
    this.alerts.push({type: 'warning', message: detailMsg });
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);

  }

  addCollegeDialog(content){
    this.alerts = [];
    this.college = new College();
    this.modalService.open(content).result.then((result) => {
      ;
    }, (reason) => {

    });
    //this.displayAdd = true;
  }

  deleteCollegeDialog(){
    this.alerts = [];
    this.displayDelete = true;
    this.college = new College();
  }

  collegeManagerDialog(id) {
    this.alerts = [];
    this.displayCollegeManager = true;
    this.collegesService.getCollege(id).subscribe(
      data => this.college = data
    );
  }

  submitCollege() {
    if (typeof(this.college.name) !== 'undefined') {
      if(this.college.name.trim().length > 0) {
        if(typeof(this.college.abbreviation) !== 'undefined'){
          if(this.college.abbreviation.trim().length > 0) {
              this.collegesService.addCollege(this.college).subscribe(
                data => {
                  this.colleges.push(data);
                  this.colleges = this.colleges.slice(0);
                }
              );
              this.college = new College();
          } else {
            this.invalidErrorMessage('empty abbreviation');
          }
        } else {
          this.invalidErrorMessage('empty abbreviation');
        }
      } else {
        this.invalidErrorMessage('empty college');
      }
    } else {
      this.invalidErrorMessage('empty college');
    }
  }

  deleteCollege(id) {
    if (typeof(id) !== 'undefined') {
      this.collegesService.deleteCollege(id).subscribe( () => {
        for (let i = 0; i < this.colleges.length; i++) {
          if (this.colleges[i]._id === id) {
            this.colleges.splice(i, 1);
            this.colleges = this.colleges.slice(0);
            break;
          }
        }
      });

      this.displayDelete = false;
      this.college = new College();
    } else {
      this.invalidErrorMessage('invalid delete');
    }
  }

  updateCollege() {
    if (this.college.name.trim().length > 0) {
      this.collegesService.updateCollege(this.college).subscribe( updatedCollege => {
        const index = this.colleges.findIndex(oldCollege => oldCollege._id === updatedCollege._id);
        this.colleges[index] = updatedCollege;
      });

      this.displayCollegeManager = false;
      this.college = new College();
    } else {
      this.invalidErrorMessage('empty college');
    }
  }
}

export interface IAlert {
  type: string;
  message: string;
}
