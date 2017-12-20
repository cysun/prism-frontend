import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroupManagerService } from './group-manager.service';
import { Group } from '../models/group.model';


@Component({
  selector: 'prism-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})
export class GroupManagerComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupManagerService: GroupManagerService, private router: Router) { }

  ngOnInit() {
    this.groupManagerService.getGroups().subscribe(data => {
      this.groups = data;
      console.log(data);
    });
  }


}
