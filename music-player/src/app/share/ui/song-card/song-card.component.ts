import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter
} from '@angular/core';

import { SongSheet } from 'src/app/data-types/common.types'

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongCardComponent implements OnInit {

  @Input() public song: SongSheet;
  @Output() public onPlay: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  public playSheet(id: number): void {
    this.onPlay.emit(id)
  }
}
