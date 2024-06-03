import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateLength',
  standalone: true,
})
export class TruncateLengthPipe implements PipeTransform {
  transform(value: string, maxLength: number): string {
    if (!value || value.length <= maxLength) {
      return value;
    }
    return value.substring(0, maxLength) + ' ...';
  }
}
