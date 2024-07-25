import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fill',
  standalone: true,
})
export class FillPipe implements PipeTransform {
  transform(value: number): Array<number> {
    return new Array(value).fill(0).map((x, i) => i);
  }
}
