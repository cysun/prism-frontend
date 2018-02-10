import { Component, OnInit } from '@angular/core';

import { ActionLogger } from '../models/action-logger.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'prism-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  logHistory: ActionLogger = new ActionLogger();

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getRootActionLogs().subscribe( data => {
      this.logHistory = data;
      console.log(data);
    })
  }

}
