import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-scroll',
  template: `
    <p>
      scroll works!
    </p>
  `,
  styles: [
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
