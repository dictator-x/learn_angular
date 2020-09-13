import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-music-progress-bar',
  templateUrl: './music-progress-bar.component.html',
  styleUrls: ['./music-progress-bar.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicProgressBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
