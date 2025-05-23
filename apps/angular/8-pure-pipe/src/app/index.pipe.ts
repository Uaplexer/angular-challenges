import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'index',
})
export class IndexPipe implements PipeTransform {
  transform(value: string | number, index: number) {
    return `${value} - ${index}`;
  }
}
