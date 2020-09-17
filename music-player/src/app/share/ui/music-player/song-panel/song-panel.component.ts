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
import { SongService } from 'src/app/service/song.service';
import { LyricProcessor } from '../song-panel/lyric';
import { BaseLyricLine } from './lyric'

@Component({
  selector: 'app-song-panel',
  templateUrl: './song-panel.component.html',
  styleUrls: ['./song-panel.component.less']
})
export class SongPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean = false;
  @Input() playing: boolean;

  public currentLyric: BaseLyricLine[];
  public currentLineNum: number;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSongChange = new EventEmitter<Song>();

  private lyric: LyricProcessor;
  private lyricRefs: NodeList;

  @ViewChildren(ScrollComponent) private scroll: QueryList<ScrollComponent>;

  get currentIndex(): number {
    return findIndex(this.songList, this.currentSong);
  }

  public scrollY: number = 0;

  constructor(
    @Inject(WINDOW) private win: Window,
    private songService: SongService
  ){}

  ngOnInit(): void {
    // console.log(this.win);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['currentSong'] ) {
      if ( this.currentSong ) {
        this.updateLyric();
        if ( this.show ) {
          this.scrollToCurrent();
        }
      }
    }
    if ( changes['show'] ) {
      if ( ! changes['show'].firstChange && this.show ) {
        this.scroll.first.refreshScroll();
        this.scroll.last.refreshScroll();
        this.win.setTimeout(() => {
          if ( this.currentSong ) {
            this.scrollToCurrent();
          }
        }, 80)
      }
    }
    if ( changes['playing'] ) {
      if ( ! changes['playing'].firstChange ) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }
  }

  private updateLyric(): void {
    this.clearLyric();
    this.songService.getLyric(this.currentSong.id).subscribe(res => {
      if ( ! res ) {
        this.currentLyric = [];
        return;
      }
      this.lyric = new LyricProcessor(res);
      this.currentLyric = this.lyric.formattedLines;
      this.scroll.last.refreshScroll();
      const startLine = res.tlyric ? 1 : 2;
      this.handlelyric(startLine);
      this.scroll.last.scrollTo(0, 0);

      if ( this.playing ) {
        this.lyric.play();
      }
    });
  }

  private handlelyric(startLine=2): void {
    this.lyric.handler.subscribe(({ lineNum }) => {
      if ( ! this.lyricRefs ) {
        this.lyricRefs = this.scroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if ( this.lyricRefs.length ) {
        this.currentLineNum = lineNum;
        if ( lineNum > startLine ) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if ( targetLine ) {
            this.scroll.last.scrollToElement(targetLine, 300, false, false);
          }
        } else {
          this.scroll.last.scrollTo(0, 0);
        }
      }
    })
  }

  private clearLyric(): void {
    if ( this.lyric ) {
      this.lyric.stop();
      this.lyric = null;
      this.lyricRefs = null;
      this.currentLineNum = 0;
      this.currentLyric = [];
    }
  }

  public seekLyric(time: number): void {
    if ( this.lyric ) {
      this.lyric.seek(time);
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
