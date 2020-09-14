import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AppStoreModule } from 'src/app/store';
import {
  getSongList,
  getPlayList,
  getCurrentSong,
  getPlayMode,
  getCurrentIndex
} from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/data-types/common.types';
import { PlayMode } from './player.types';
import { setCurrentIndex } from 'src/app/store/actions/player.actions';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {

  public progressBarOffset: number = 35;
  public bufferProgressBarOffset: number = 70;

  private songList: Song[];
  private playList: Song[];
  private currentIndex: number;
  public currentSong: Song;
  private playMode: PlayMode;
  public currentPlayingTimeOffset: number;

  private songReady: boolean = false;
  public playing: boolean = false;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store: Store<AppStoreModule>
  ){}

  ngOnInit(): void {

    const stateArr: any[] = [
      {
        type: getSongList,
        cb: list => this.watchList(list, 'songList')
      },
      {
        type: getPlayList,
        cb: list => this.watchList(list, 'playList')
      },
      {
        type: getCurrentIndex,
        cb: index => this.watchCurrentIndex(index)
      },
      {
        type: getPlayMode,
        cb: mode => this.watchPlayMode(mode)
      },
      {
        type: getCurrentSong,
        cb: song => this.watchCurrentSong(song)
      },
    ];
    stateArr.forEach((state) => {
      this.store.pipe(select(state.type)).subscribe(state.cb)
    });
  }

  ngAfterViewInit(): void {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string): void {
    this[type] = list;
  }

  private watchCurrentIndex(index: number): void {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode): void {
    this.playMode = mode;
  }

  private watchCurrentSong(song: Song): void {
    this.currentSong = song;
  }

  public onTimeUpdate(e: Event): void {
    this.currentPlayingTimeOffset = (<HTMLAudioElement>e.target).currentTime;
  }

  public onCanPlay(): void {
    console.log("aa")
    this.songReady = true;
    this.play();
  }

  public onToggle(): void {
    if ( ! this.currentSong ) {
      if ( this.playList.length ) {
        this.store.dispatch(setCurrentIndex({ currentIndex: 0 }))
        this.songReady = false;
      }
    } else {
      if ( this.songReady ) {
        this.playing = ! this.playing;
        this.playing ? this.audioEl.play() : this.audioEl.pause();
      }
    }
  }

  public onPrev(): void {
    if ( ! this.songReady ) return;
    const newIndex = this.currentIndex === 0 ? this.playList.length - 1 : this.currentIndex - 1;
    this.updateIndex(newIndex);
  }

  public onNext(): void {
    if ( ! this.songReady ) return;
    const newIndex = this.currentIndex === this.playList.length - 1 ? 0 : this.currentIndex + 1;
    this.updateIndex(newIndex);
  }

  private updateIndex(index: number): void {
    this.store.dispatch(setCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  private play(): void {
    this.audioEl.play();
    this.playing = true;
  }

  private loop(): void {
    this.audioEl.currentTime = 0;
    this.play();
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.url : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  get duration(): number {
    return this.currentSong ? this.currentSong.dt / 1000 : null;
  }
}
