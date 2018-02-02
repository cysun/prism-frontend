import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'prism-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { }
}
