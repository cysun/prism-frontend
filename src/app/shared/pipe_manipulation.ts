import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  pure: false
})

export class ReversePipe implements PipeTransform {
  transform(value) {
    if (!value) { return; }
    return value.reverse();
  }
}


@Pipe({
  name: 'sort'
})

export class SortPipe implements PipeTransform {
  transform(arr: Array<string>, args: string): Array<string> {
    arr.sort((a: any, b: any) => {
      if (a.name) {
        if (a.name.first) {
          const aFullName = a.name.first.toLowerCase() + ' ' + a.name.last.toLowerCase();
          const bFullName = b.name.first.toLowerCase() + ' ' + b.name.last.toLowerCase();

          if (aFullName < bFullName) {
            return -1;
          } else if (aFullName > bFullName) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        }
      } else if (a.program) {
        if (a.program.name.toLowerCase() < b.program.name.toLowerCase()) {
          return -1;
        } else if (a.program.name.toLowerCase() > b.program.name.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return arr;
  }
}
