import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class Globals {

  maxFileSize = (2 ** 20) * 5;

  /* Calendar colors for event dots */
  calendarColors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

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
    sortField: {
      field: 'username',
      direction: 'asc'
    },
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
    sortField: {
      field: 'username',
      direction: 'asc'
    },
    maxItems: 15
  };

  /* Config for ng-selectize's component for multiple inputs for groups */
  multipleGroupConfig = {
    labelField: 'name',
    valueField: '_id',
    highlight: true,
    create: false,
    openOnFocus: false,
    searchField: ['name'],
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    selectOnTab: true,
    sortField: {
      field: 'name',
      direction: 'asc'
    },
    maxItems: 15
  };
}