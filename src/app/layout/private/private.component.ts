import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'prism-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  username: string;
  isCollapsed: boolean;

  constructor(@Inject('Window') private window: Window,
    private authService: AuthService,
    private router: Router,
    public sharedService: SharedService) { }

  ngOnInit() {
    const user = this.authService.getUser();
    this.username = user.user.username;
    this.isCollapsed = window.innerWidth < 990 ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 990) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.router.navigate(['login']);
  }
}
