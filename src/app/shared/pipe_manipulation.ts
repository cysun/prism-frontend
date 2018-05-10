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
      let compareA = a;
      let compareB = b;

      /* Determine how to sort by given keys */
      if (a.name) {
        if (a.name.first) {
          compareA = `${a.name.first.toLowerCase()} ${a.name.last.toLowerCase()}`;
          compareB = `${b.name.first.toLowerCase()} ${b.name.last.toLowerCase()}`;
        } else {
          compareA = a.name;
          compareB = b.name;
        }
      } else if (a.program) {
        const yearA = new Date(a.startDate).getFullYear();
        const yearB = new Date(b.startDate).getFullYear();

        compareA = (`${a.program.name.toLowerCase()} ${yearA}-${yearA + 1}`);
        compareB = (`${b.program.name.toLowerCase()} ${yearB}-${yearB + 1}`);
      } else if (a.title) {
        compareA = a.title.toLowerCase();
        compareB = b.title.toLowerCase();
      } else if (a.toLowerCase()) {
        compareA = a.toLowerCase();
        compareB = b.toLowerCase();
      }

      /* Does the actual comparisons to sort */
      if (compareA < compareB) {
        return -1;
      } else if (compareA > compareB) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }
}
