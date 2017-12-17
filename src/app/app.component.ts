import {Component} from '@angular/core';
import {MenuItem} from 'primeng/components/common/api';

@Component({
  selector: 'prism-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  items: MenuItem[];
  actionMenu: MenuItem[];

  ngOnInit() {
    this.items = [ { label: 'PRISM', icon: 'fa-2x fa-diamond ' }];

    this.actionMenu = [{
            label: 'Actions',
            items: [
                { label: 'Dashboard', icon: 'fa-home' },
                { label: 'Calendar', icon: 'fa-calendar'},
                { label: 'Minutes', icon: 'fa-clock-o'},
                { label: 'Resources', icon: 'fa-folder-open-o'},
                { label: 'Committee', icon: 'fa-users' }
            ]
        }];
  }
}
