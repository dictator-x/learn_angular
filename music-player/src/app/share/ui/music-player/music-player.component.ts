import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AppStoreModule } from 'src/app/store'
import {
  getSongList,
  getPlayList,
  getCurrentSong,
  getPlayMode,
  getCurrentIndex
} from 'src/app/store/selectors/player.selector'
import { Song } from 'src/app/data-types/common.types'
import { PlayMode } from './player.types'

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

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store: Store<AppStoreModule>
  ){}

  ngOnInit(): void {

    const stateArr: any[] = [
      {
        type: getSongList,
        cb: list => this.watchList(list, 'songlist')
      },
      {
        type: getPlayList,
        cb: list => this.watchList(list, 'playlist')
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

  public onCanPlay():void {
    this.play();
  }

  private play(): void {
    this.audioEl.play();
  }
}
