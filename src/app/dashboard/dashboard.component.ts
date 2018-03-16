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
  logHistory: ActionLogger[] = [];
  userActions: ActionLogger[] = [];
  displayHistory: ActionLogger[] = [];

  allLogs = [];

  page = 1;
  resultPage = 0;
  itemsPerPage = 20;
  totalLogs: number;
  totalNumOfPages: number;

  isAdmin: boolean;
  selectedOption = 'All';

  public filterOptions = ['All', 'College', 'Department', 'Document', 'Group',
  'Program', 'Review'];

  constructor(private dashboardService: DashboardService,
              private router: Router,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(JSON.stringify(this.currentUser.groups))

    this.isAdmin = this.currentUser.groups.some( x => x.name === 'Administrators')
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
    const filteredList = [];
    const user = this.sharedService.searchUser[0];

    this.numberOfActions(user);

    if (user) {
      this.getUserActionLogs(user).then( (result: ActionLogger[]) => {
        console.log('what is user: ' + user)

        for (let i = 0; i < result.length; i++) {
          if (this.selectedOption === 'All') {
            filteredList.push(result[i]);
          } else if (this.selectedOption.toLowerCase() === result[i].type) {
            filteredList.push(result[i]);
          }
        }
        this.displayHistory = filteredList;
        console.log(this.displayHistory)
      })
    }
  }

  getUserActionLogs(username?: string) {
    // return list of actions of a specific user
    if (username) {
      return new Promise((resolve, reject) => {
        this.dashboardService.getUserActionLogs(username, (this.resultPage)).subscribe( data => {
          this.allLogs[this.resultPage] = data;
          this.displayHistory = this.allLogs[this.resultPage];

          console.log(this.allLogs);
          resolve(data);
        })
      });
    }

    // return list of all recent actions
    return new Promise((resolve, reject) => {
      this.dashboardService.getRootActionLogs(this.resultPage ).subscribe( data => {
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
      this.getUserActionLogs(this.currentUser._id);

    } else {
      this.resultPage = page - 1;

      const beginningItem = (this.page) * this.itemsPerPage; // last value of the last page
      const endingItem = this.page * this.itemsPerPage; // last value of the current page

      console.log('Calculation: ' + beginningItem + ' / ' + this.itemsPerPage + ' = Page #' + this.resultPage)
    }
    this.displayHistory = this.allLogs[this.resultPage];
    console.log('current resultPage: ' + (this.resultPage));
  }


  numberOfActions(username?: string) {
    this.dashboardService.getNumberOfUserLogs(username).subscribe( data => {
      console.log('total cost: ' + data.count)
      this.totalLogs = data.count;

      this.totalNumOfPages = Math.ceil(this.totalLogs / this.itemsPerPage)
      this.allLogs = new Array(this.totalNumOfPages).fill(null);
    })
  }
}
