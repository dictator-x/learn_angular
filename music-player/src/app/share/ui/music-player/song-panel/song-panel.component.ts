import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges, Output, EventEmitter,
  ViewChildren,
  QueryList,
  Inject
} from '@angular/core';

import { timer } from 'rxjs';

import { Song } from 'src/app/data-types/common.types';
import { ScrollComponent } from '../scroll/scroll.component';
import { findIndex } from 'src/app/util/array';
import { WINDOW } from 'src/app/service/service.module';

@Component({
  selector: 'app-song-panel',
  templateUrl: './song-panel.component.html',
  styleUrls: ['./song-panel.component.less']
})
export class SongPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSongChange = new EventEmitter<Song>();

  @ViewChildren(ScrollComponent) private scroll: QueryList<ScrollComponent>;

  get currentIndex(): number {
    return findIndex(this.songList, this.currentSong);
  }

  public scrollY: number = 0;

  constructor(@Inject(WINDOW) private win: Window){}

  ngOnInit(): void {
    console.log(this.win);
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
        // timer(80).subscribe(() => {
        //   if ( this.currentSong ) {
        //     this.scrollToCurrent();
        //   }
        // });
        this.win.setTimeout(() => {
          if ( this.currentSong ) {
            this.scrollToCurrent();
          }
        }, 80)
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
