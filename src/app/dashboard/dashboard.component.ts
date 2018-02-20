import { Component, OnInit } from '@angular/core';

import { ActionLogger } from '../models/action-logger.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'prism-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  logHistory: ActionLogger[] = [];
  userActions: ActionLogger[] = [];
  displayHistory: ActionLogger[] = [];

  allLogs = [];

  page = 1;
  resultPage = 0;
  itemsPerPage = 25;
  totalLogs: number;

  testIndex = 0;
  selectedOption = 'All';

  public filterOptions = ['All', 'College', 'Department', 'Document', 'Group',
  'Program', 'Review'];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.numberOfActions();
    this.loadPage(0);
  }

  searchUserActions(username: string) {
    const filteredList = [];

    if (username && (username.trim().length > 0)) {
      this.getActionLogs().then( () => {
        for (let i = 0; i < this.logHistory.length; i++) {
          if ((this.selectedOption === 'All') && (this.logHistory[i].user)) {
            if (username.toLowerCase() === (this.logHistory[i].user.username).toLowerCase()) {
              filteredList.push(this.logHistory[i]);
            }
          } else if ((this.selectedOption.toLowerCase() === this.logHistory[i].type) && (this.logHistory[i].user)) {
            if (username.toLowerCase() === (this.logHistory[i].user.username).toLowerCase()) {
              filteredList.push(this.logHistory[i]);
            }
          }
        }
        this.logHistory = filteredList;
      })
    }
  }

  getActionLogs() {
    return new Promise((resolve, reject) => {
      this.dashboardService.getRootActionLogs(this.resultPage).subscribe( data => {
        this.logHistory = data;
        resolve();
      })
    });
  }

  loadPage(page: number) {
    const beginningItem = (this.page - 1) * this.itemsPerPage; // last value of the last page
    const endingItem = this.page * this.itemsPerPage; // last value of the current page

    // if (endingItem > (150 * (this.resultPage + 1))) {

    /* If we currently don't have a download of the next set of action logs */
    if (endingItem > (150 * (this.resultPage))) {
      this.resultPage += 1;
      this.testIndex += 1;

      return new Promise((resolve, reject) => {
        this.dashboardService.getRootActionLogs(this.resultPage - 1).subscribe( data => {
          this.allLogs.push(data);

          console.log('what is the: ' + (this.allLogs.length - 1))
          this.displayHistory = this.allLogs[this.allLogs.length - 1].slice(beginningItem, endingItem);
          console.log(this.allLogs);
          resolve();
        })
      });
    }

    // } else if (beginningItem < (150 * this.resultPage)) {
    //   console.log('subtracting is called')
    //   this.testIndex -= 1;
    //
    //
    //   return;
    //
    //
    // } else {
    //
    // }

    this.displayHistory = this.allLogs[this.testIndex - 1].slice(beginningItem, endingItem);
    console.log('front page: ' + beginningItem + ' and back page: ' + endingItem);
    console.log('current resultPage: ' + (this.resultPage - 1));
  }

  numberOfActions() {
    this.dashboardService.getNumberOfActions().subscribe( data => {
      this.totalLogs = data.count;
    })
  }
}
