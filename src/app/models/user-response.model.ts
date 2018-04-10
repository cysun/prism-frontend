import { User } from './user.model';

export class UserResponse {
  constructor(public user: User,
    public groups: [{name: string, _id: string}],
    public token: string) {}

  public isRootOrAdmin(): boolean {
    return this.user.root || this.groups.reduce((admin, group) => {
      return admin || group.name === 'Administrators';
    }, false);
  }
}
