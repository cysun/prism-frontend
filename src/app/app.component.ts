import {Component} from '@angular/core';
import {MenuItem} from 'primeng/components/common/api';

@Component({
  selector: 'prism-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  items: MenuItem[];

  ngOnInit() {
    this.items = [ { label: 'PRISM', icon: 'fa-2x fa-diamond ' }];
  }
}
