import { User } from './user.model';

export class UserResponse {
  constructor(public user: User,
    public groups: [{name: string, _id: string}],
    public token: string) {}

  public isRootOrAdmin(): boolean {
    console.log(this.groups);
    return this.user.root || this.groups.reduce((admin, group) => {
      return admin || group.name === 'Administrators';
    }, false);
  }
}
