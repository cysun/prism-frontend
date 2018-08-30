import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: []
})
export class UserFormComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = new User();
    this.user.name = { first: '', last: '' };
    this.user.internal = false;
    this.user.disabled = false;
  }

  onSubmit() {
    this.userService.createUser(this.user).subscribe(newUser => {
      this.router.navigate(['users', newUser._id]);
    });
  }
}
