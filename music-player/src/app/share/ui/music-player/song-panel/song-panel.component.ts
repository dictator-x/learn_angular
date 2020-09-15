import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges, Output, EventEmitter,
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

  public scrollY: number = 0;

  constructor(){}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['currentSong'] ) {
      if ( this.currentSong ) {
        if ( this.show ) {
          this.scrollToCurrent();
        }
      }
    }
    if ( changes['show'] ) {
      if ( ! changes['show'].firstChange && this.show ) {
        this.scroll.first.refreshScroll();
      }
    }
  }

  public onScrollEnd(scrollEnd :number) {
    this.scrollY = scrollEnd;
  }

  private scrollToCurrent(): void {
    const songListRefs = this.scroll.first.el.nativeElement.querySelectorAll('ul li');
    if ( songListRefs.length ) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;

      if ( offsetTop - Math.abs(this.scrollY) > offsetHeight * 5) {
        this.scroll.first.scrollToElement(currentLi, 300, false, false);
      }

      if ( offsetTop < Math.abs(this.scrollY) ) {
        this.scroll.first.scrollToElement(currentLi, 300, false, false);

      }

    }
  }
}
