import { Component, OnInit } from '@angular/core';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

import { GroupManagerService } from '../group-manager/group-manager.service';

@Component({
  selector: 'prism-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css']
})
export class CommitteeComponent implements OnInit {
  prs: Group = new Group();
  currentUser: User = new User();

  constructor(private groupManagerService: GroupManagerService) { }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.groupManagerService.getPrs().subscribe( data => {
      this.prs = data;
    })
  }

}
