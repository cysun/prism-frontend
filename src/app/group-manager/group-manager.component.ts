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
  displayAdd: Boolean = false;
  displayDelete: Boolean = false;
  group: Group = new Group();
  groups: Group[] = [];

  constructor(private groupManagerService: GroupManagerService, private router: Router) { }

  ngOnInit() {
    this.groupManagerService.getGroups().subscribe(data => {
      this.groups = data;
      console.log(data);
    });
  }

  addGroupDialog() { this.displayAdd = true; }

  deleteGroupDialog() { this.displayDelete = true; }

  submitGroup() {
    this.groupManagerService.addGroup(this.group).subscribe(
      data => this.groups.push(data),
      err => console.log(err)
    );
    this.displayAdd = false;
  }

  deleteGroup(id) {
    this.groupManagerService.deleteGroup(id).subscribe(
      data => this.groups.splice(this.groups.indexOf(data), 1),
      err => console.log(err)
    );
    this.displayDelete = false;
    this.group = new Group();
  }
}
