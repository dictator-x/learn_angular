import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import type { ProgressBarStyle } from './progress-types'

@Component({
  selector: 'app-music-progress-track',
  template: `<div class="progress-track" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicProgressTrackComponent implements OnInit, OnChanges {

  @Input() public isVertical: boolean = false;
  @Input() public length: number;

  public style: ProgressBarStyle = {}
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['length'] ) {
      if ( this.isVertical ) {
        this.style.height = this.length + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.length + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }
}
