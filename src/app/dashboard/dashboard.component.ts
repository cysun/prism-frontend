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
  page = 1;

  itemsPerPage = 25;
  totalItems: number;
  previousPage: any;

  selectedOption = 'All';

  public filterOptions = ['All', 'College', 'Department', 'Document', 'Group',
  'Program', 'Review'];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getActionLogs();
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
      this.dashboardService.getRootActionLogs().subscribe( data => {
        this.logHistory = data;
        // this.logHistory = data.slice(this.page - 1, this.itemsPerPage);
        resolve();
      })
    });
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.getActionLogs();
    }
  }
}
