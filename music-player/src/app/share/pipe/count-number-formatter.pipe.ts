import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countNumberFormatter'
})
export class CountNumberFormatterPipe implements PipeTransform {

  transform(value: number): string {
    if ( value >= 1100000 ) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if ( value >= 1000000 ) {
      return (value / 1000000).toFixed(0) + 'M';
    }
    if ( value >= 100000 ) {
      return (value / 1000).toFixed(0) + 'K';
    }
    if ( value >= 10000 ) {
      return (value / 1000).toFixed(0) + 'K';
    }
    if ( value >= 1100 ) {
      return (value / 1000).toFixed(1) + 'K';
    }
    if ( value >= 1000 ) {
      return (value / 1000).toFixed(0) + 'K'
    }
    return value.toFixed(0)
  }

}
