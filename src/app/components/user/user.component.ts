import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {
  user: User;
  editable = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params['id']) {
        this.router.navigate(['/users']);
        return;
      }
      this.userService.getUser(params['id']).subscribe(user => {
        this.user = user;
      });
    });
  }

  onSubmit() {
    this.userService.updateUser(this.user).subscribe(() => {
      this.editable = false;
    });
  }
}
