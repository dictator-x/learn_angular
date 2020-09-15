import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';

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
import { setCurrentIndex, setPlayMode, setPlayList } from 'src/app/store/actions/player.actions';
import { shuffle } from 'src/app/util/array';

const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: 'loop'
  },
  {
    type: 'random',
    label: 'random'
  },
  {
    type: 'singleLoop',
    label: 'single'
  },
]

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {

  public progressBarPercent: number = 0;
  public bufferProgressBarPercent: number = 0;

  private songList: Song[];
  private playList: Song[];
  private currentIndex: number;
  public currentSong: Song;
  public currentPlayingTimeOffset: number;

  private songReady: boolean = false;
  public playing: boolean = false;

  public volume: number = 60;
  public showVolumePanel: boolean = false;

  public selfClick: boolean = false;
  private winClick: Subscription;

  public currentMode: PlayMode;
  public modeCount: number = 0;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
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
    this.currentMode = mode;
    if ( this.songList && this.songList.length != 0 ) {
      let list = this.songList.slice();
      if ( mode.type === 'random' ) {
        list = shuffle<Song>(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store.dispatch(setPlayList({ playList: list }));
      } else if ( mode.type === 'loop' ) {
        this.updateCurrentIndex(list, this.currentSong);
        this.store.dispatch(setPlayList({ playList: list }));
      }
    }
  }

  private updateCurrentIndex(list: Song[], currentSong: Song): void {
    const newIndex = list.findIndex(item => item.id === currentSong.id);
    this.store.dispatch(setCurrentIndex({ currentIndex: newIndex }));
  }

  private watchCurrentSong(song: Song): void {
    this.currentSong = song;
  }

  public onEnded(): void {
    this.playing = false;
    if ( this.currentMode.type === 'singleLoop' ) {
      this.loop();
    } else {
      this.onNext();
    }
  }

  public changeMode(): void {
    const temp = modeTypes[++this.modeCount % 3]
    this.store.dispatch(setPlayMode({ playMode: temp }));
  }

  public onPercentChange(per: number) {
    this.audioEl.currentTime = this.duration * (per / 100);
  }

  public onTimeUpdate(e: Event): void {
    this.currentPlayingTimeOffset = (<HTMLAudioElement>e.target).currentTime;
    this.progressBarPercent = (this.currentPlayingTimeOffset / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    //TODO: improvement with dragging buffer.
    if ( buffered.length && this.bufferProgressBarPercent < 100 ) {
      this.bufferProgressBarPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  public toggleVolumePanel(e: MouseEvent): void {
    this.togglePanel();
  }

  private togglePanel(): void {
    this.showVolumePanel = ! this.showVolumePanel;
    if ( this.showVolumePanel ) {
      this.bindDocumentClickListener();
    } else {
      this.unBindDocumentClickListener();
    }
  }

  private bindDocumentClickListener(): void {
    if ( ! this.winClick ) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        console.log(this.selfClick);
        if ( ! this.selfClick ) {
          this.showVolumePanel = false;
          this.unBindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  private unBindDocumentClickListener() {
    if ( this.winClick ) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  public onVolumeChange(volumePer: number): void {
    this.audioEl.volume = volumePer / 100;
  }

  public onCanPlay(): void {
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
