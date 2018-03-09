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
  itemsPerPage = 20;
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

  searchUserActions(username?: string) {
    const filteredList = [];

    this.numberOfActions(username);

    if (username && (username.trim().length > 0)) {
      this.getUserActionLogs(username).then( (result: ActionLogger[]) => {

        for (let i = 0; i < result.length; i++) {
          if (this.selectedOption === 'All') {
            filteredList.push(result[i]);
          } else if (this.selectedOption.toLowerCase() === result[i].type) {
            filteredList.push(result[i]);
          }
        }
        this.displayHistory = filteredList;
      })
    }
  }

  getUserActionLogs(username?: string) {
    if (username) {
      return new Promise((resolve, reject) => {
        this.dashboardService.getUserActionLogs(username, (this.resultPage - 1)).subscribe( data => {
          resolve(data);
        })
      });
    }
    return new Promise((resolve, reject) => {
      this.dashboardService.getRootActionLogs(this.resultPage - 1).subscribe( data => {
        this.allLogs.push(data);
        this.displayHistory = this.allLogs[this.resultPage - 1];
        // console.log(this.allLogs);
        resolve();
      })
    });




  }

  loadPage(page: number, ) {
    const beginningItem = (this.page - 1) * this.itemsPerPage; // last value of the last page
    const endingItem = this.page * this.itemsPerPage; // last value of the current page

    console.log('beginning: ' + beginningItem + ' and ending: ' + endingItem);

    if (endingItem > (this.itemsPerPage * this.allLogs.length)) {
      this.resultPage = this.allLogs.length + 1;

      this.getUserActionLogs();

      // return new Promise((resolve, reject) => {
      //   this.dashboardService.getRootActionLogs(this.resultPage - 1).subscribe( data => {
      //     this.allLogs.push(data);
      //     this.displayHistory = this.allLogs[this.resultPage - 1];
      //     console.log(this.allLogs);
      //     resolve();
      //   })
      // });

    } else {
      this.resultPage = (beginningItem / this.itemsPerPage);
      console.log('Calculation: ' + beginningItem + ' / ' + this.itemsPerPage + ' = Page #' + this.resultPage)
    }
    this.displayHistory = this.allLogs[this.resultPage];
    console.log('current resultPage: ' + (this.resultPage));
  }

  numberOfActions(username?: string) {
    this.dashboardService.getNumberOfUserLogs(username).subscribe( data => {
      console.log('total cost: ' + data.count)
      this.totalLogs = data.count;

      const totalNumOfPages = Math.ceil(this.totalLogs / this.itemsPerPage)
      // this.displayHistory = new Array(totalNumOfPages);

      console.log(this.displayHistory)
    })
  }
}
