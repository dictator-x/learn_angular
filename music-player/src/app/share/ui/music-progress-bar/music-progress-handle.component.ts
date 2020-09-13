import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { ProgressBarStyle } from './progress-types'

@Component({
  selector: 'app-music-progress-handle',
  template: `<div class="progress-handle" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicProgressHandleComponent implements OnInit, OnChanges {

  @Input() public isVertical: boolean = false;
  @Input() public offset: number;

  public style: ProgressBarStyle = {}

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['offset'] ) {
      this.style[this.isVertical ? 'bottom' : 'left'] = this.offset + '%';
    }
  }

}
