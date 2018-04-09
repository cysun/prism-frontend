import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class Globals {

  /* Config for bootstrap's modal */
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };

  /* Config for ng-selectize's component for single input */
  singleConfig = {
    labelField: 'username',
    valueField: '_id',
    highlight: true,
    create: false,
    openOnFocus: false,
    searchField: ['username'],
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    selectOnTab: true,
    sortField: 'text',
    maxItems: 1
  };

  /* Config for ng-selectize's component for multiple inputs */
  multipleConfig = {
    labelField: 'username',
    valueField: '_id',
    highlight: true,
    create: false,
    openOnFocus: false,
    searchField: ['username'],
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    selectOnTab: true,
    sortField: 'text',
    maxItems: 15
  };
}
