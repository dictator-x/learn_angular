import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';

import { Song } from 'src/app/data-types/common.types'
import { ScrollComponent } from '../scroll/scroll.component'

@Component({
  selector: 'app-song-panel',
  templateUrl: './song-panel.component.html',
  styleUrls: ['./song-panel.component.less']
})
export class SongPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSongChange = new EventEmitter<Song>();

  @ViewChildren(ScrollComponent) private scroll: QueryList<ScrollComponent>;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['show'] ) {
      if ( ! changes['show'].firstChange && this.show ) {
        this.scroll.first.refreshScroll();
      }
    }
  }

}
