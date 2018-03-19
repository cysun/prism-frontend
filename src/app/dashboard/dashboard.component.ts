import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { ActionLogger } from '../models/action-logger.model';

import { DashboardService } from './dashboard.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'prism-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  currentUser: User = new User();
  allLogs = [];
  displayHistory: ActionLogger[] = [];

  page = 1;
  resultPage = 0;
  itemsPerPage = 20;
  totalLogs: number;
  totalNumOfPages: number;

  selectedOption = 'All';

  public filterOptions = [
    'All', 'College', 'Department', 'Document', 'Group', 'Program', 'Review'
  ];

  constructor(private router: Router,
              private dashboardService: DashboardService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.numberOfActions(this.currentUser._id);
    this.loadPage(this.page);
  }

  goToLink(actionType: string, actionId: string) {
    if (actionType === 'document' || actionType === 'review') {
      this.router.navigate ([`${ actionType }/${actionId}`]);
    } else {
      this.router.navigate ([`${ actionType }`]);
    }
  }

  searchUserActions(username?: string) {
    const user = this.sharedService.searchUser;

    if (user) {
      if (this.selectedOption === 'All') {
        this.numberOfActions(user);
        this.getUserActionLogs(user).then( (result: ActionLogger[]) => {
          this.displayHistory = result;
        });
        return;
      } else {
        this.numberOfActions(user, this.selectedOption.toLowerCase());
        this.getUserActionLogs(user, this.selectedOption.toLowerCase()).then(
          (result: ActionLogger[]) => {
            this.displayHistory = result;
        });
        return;
      }
    }
    this.numberOfActions(this.currentUser._id);
  }

  getUserActionLogs(username?: string, type?: string) {
    // return list of actions of a specific user
    if (username) {
      return new Promise((resolve, reject) => {
        this.dashboardService.getUserActionLogs(username, this.resultPage, type)
          .subscribe( data => {
            this.allLogs[this.resultPage] = data;
            this.displayHistory = this.allLogs[this.resultPage];

            console.log(this.allLogs);
            resolve(data);
        })
      });
    }

    // return list of all recent actions
    return new Promise((resolve, reject) => {
      this.dashboardService.getRootActionLogs(this.resultPage).subscribe( data => {
        this.allLogs[this.resultPage] = data;
        this.displayHistory = this.allLogs[this.resultPage];

        console.log(this.allLogs);
        resolve();
      })
    });
  }

  loadPage(page: number) {
    if (this.allLogs[page - 1] == null) {
      this.resultPage = page - 1;
      const user = this.sharedService.searchUser;

      if (user) {
        this.selectedOption !== 'All' ? this.getUserActionLogs( user,
          this.selectedOption.toLowerCase()) : this.getUserActionLogs(user);
      } else { this.getUserActionLogs(this.currentUser._id); }
    } else {
      this.resultPage = page - 1;

      const beginningItem = (this.page) * this.itemsPerPage;
      const endingItem = this.page * this.itemsPerPage;

      console.log('Calculation: ' + beginningItem + ' / ' + this.itemsPerPage +
        ' = Page #' + this.resultPage)
    }
    this.displayHistory = this.allLogs[this.resultPage];
    console.log('current resultPage: ' + (this.resultPage));
  }


  numberOfActions(username?: string, type?: string) {
    this.dashboardService.getNumberOfUserLogs(username, type).subscribe( data => {
      console.log('total cost: ' + data.count);
      this.totalLogs = data.count;

      this.totalNumOfPages = Math.ceil(this.totalLogs / this.itemsPerPage);
      this.allLogs = new Array(this.totalNumOfPages).fill(null);
    })
  }
}
