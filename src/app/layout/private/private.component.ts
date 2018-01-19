import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/components/common/api';

import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'prism-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  actionMenu: MenuItem[];
  menuItems: MenuItem[];
  userMenuItems: MenuItem[];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.actionMenu = [{
      label: 'Actions',
      items: [
        { label: 'Dashboard', icon: 'fa-home', routerLink: '/dashboard' },
        { label: 'Calendar', icon: 'fa-calendar', routerLink: '/calendar'},
        { label: 'Minutes', icon: 'fa-clock-o', routerLink: '/minutes'},
        { label: 'College Hierarchy', icon: 'fa-graduation-cap', routerLink: '/colleges'},
        { label: 'Resources', icon: 'fa-folder-open-o', routerLink: '/resources'},
        { label: 'Committee', icon: 'fa-users', routerLink: '/committee' }
      ]
    }];
  }
}
