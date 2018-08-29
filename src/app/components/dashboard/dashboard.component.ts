import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ActionLogger } from '../../models/action-logger.model';
import { Globals } from '../../shared/app.global';
import { User } from '../../models/user.model';

import { DashboardService } from '../../services/dashboard.service';
import { SharedService } from '../../shared/shared.service';

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
  totalLogs: number;
  totalNumOfPages: number;

  selectedOption = 'All';

  public filterOptions = [
    'All', 'Calendar', 'College', 'Department', 'Document', 'Event', 'Group', 'Program', 'Review'
  ];

  constructor(private globals: Globals,
              private router: Router,
              private dashboardService: DashboardService,
              public sharedService: SharedService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.numberOfActions(this.currentUser._id);
    this.loadPage(this.page);
  }

  goToLink(actionType: string, actionId: string) {
    if (actionType === 'document' || actionType === 'review') {
      this.router.navigate([`${ actionType }/${actionId}`]);
    } else if (actionType === 'college' || actionType === 'department' || actionType === 'program') {
      this.router.navigate(['university-hierarchy']);
    } else if (actionType === 'event') {
      this.router.navigate(['calendar']);
    } else if (actionType === 'group') {
      this.router.navigate(['groups']);
    } else if (actionType === 'resource') {
      this.router.navigate(['resources']);
    } else {
      this.router.navigate([`${ actionType }`]);
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
    } else {
      this.getUserActionLogs();
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
            resolve(data);
        })
      });
    }

    // return list of all recent actions
    return new Promise((resolve, reject) => {
      this.dashboardService.getRootActionLogs(this.resultPage).subscribe( data => {
        this.allLogs[this.resultPage] = data;
        this.displayHistory = this.allLogs[this.resultPage];
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

      const beginningItem = (this.page) * this.globals.actionsPerPage;
      const endingItem = this.page * this.globals.actionsPerPage;
    }
    this.displayHistory = this.allLogs[this.resultPage];
  }


  numberOfActions(username?: string, type?: string) {
    this.dashboardService.getNumberOfUserLogs(username, type).subscribe( data => {
      this.totalLogs = data.count;

      this.totalNumOfPages = Math.ceil(this.totalLogs / this.globals.actionsPerPage);
      this.allLogs = new Array(this.totalNumOfPages).fill(null);
    })
  }
}
