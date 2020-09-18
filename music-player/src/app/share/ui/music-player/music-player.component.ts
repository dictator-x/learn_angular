import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd';

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
import {
  setCurrentIndex,
  setPlayMode,
  setPlayList,
  setSongList
} from 'src/app/store/actions/player.actions';
import { shuffle, findIndex } from 'src/app/util/array';
import { SongPanelComponent } from './song-panel/song-panel.component';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

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

  public songList: Song[];
  private playList: Song[];
  public currentIndex: number;
  public currentSong: Song;
  public currentPlayingTimeOffset: number;

  private songReady: boolean = false;
  public playing: boolean = false;

  public volume: number = 5;
  public showVolumePanel: boolean = false;
  public showSongListPanel: boolean = false;

  public bindFlag: boolean = false;

  public currentMode: PlayMode;
  public modeCount: number = 0;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  @ViewChild(SongPanelComponent, { static: false }) private songPanel: SongPanelComponent;
  private audioEl: HTMLAudioElement;

  constructor(
    private store: Store<AppStoreModule>,
    private nzModelService: NzModalService,
    private batchActionsService: BatchActionsService
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
        // this.updateCurrentIndex(this.songList, this.currentSong);
        this.store.dispatch(setPlayList({ playList: list }));
      } else if ( mode.type === 'loop' ) {
        // this.updateCurrentIndex(this.songList, this.currentSong);
        this.store.dispatch(setPlayList({ playList: list }));
      }
    }
  }

  private updateCurrentIndex(currentSong: Song): void {
    const newIndex = this.songList.findIndex(item => item.id === currentSong.id);
    this.store.dispatch(setCurrentIndex({ currentIndex: newIndex }));
  }

  private watchCurrentSong(song: Song): void {
    this.currentSong = song;
  }

  public onEnded(): void {
    this.playing = false;
    if ( this.currentMode.type === 'singleLoop' || this.songList.length == 1 ) {
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
    if ( this.currentSong ) {
      const time = this.duration * (per /100);
      this.audioEl.currentTime = time;
      if ( this.songPanel ) {
        this.songPanel.seekLyric(time * 1000);
      }
    }
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
    this.togglePanel('showVolumePanel');
  }

  public toggleSongListPanel(e: MouseEvent): void {
    if ( this.songList.length ) {
      this.togglePanel('showSongListPanel');
    }
  }

  public onClickOutSide(): void {
    console.log('aa')
    this.showVolumePanel = false;
    this.showSongListPanel = false;
    (this.showVolumePanel || this.showSongListPanel) ? this.bindFlag = true : this.bindFlag = false;
  }

  private togglePanel(type: string): void {
    this[type] = ! this[type];
    (this.showVolumePanel || this.showSongListPanel) ? this.bindFlag = true : this.bindFlag = false;
  }

  public onSongChange(song: Song): void {
    this.updateCurrentIndex(song);
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

  //TODO: refactor random mode.
  public onPrev(): void {
    if ( ! this.songReady ) return;
    const playListIndex = this.getCurrentPlayListIndex(this.currentSong);
    const newIndex = playListIndex === 0 ? this.playList.length - 1 : playListIndex - 1;
    this.updateCurrentIndex(this.playList[newIndex]);
  }

  public onNext(): void {
    if ( ! this.songReady ) return;
    const playListIndex = this.getCurrentPlayListIndex(this.currentSong);
    const newIndex = playListIndex === this.playList.length - 1 ? 0 : playListIndex + 1;
    this.updateCurrentIndex(this.playList[newIndex]);
  }

  private getCurrentPlayListIndex(song: Song): number {
    return this.playList.findIndex(item => item.id === song.id);
  }


  private play(): void {
    this.audioEl.play();
    this.playing = true;
  }

  private loop(): void {
    this.audioEl.currentTime = 0;
    this.play();
    if ( this.songPanel ) {
      this.songPanel.seekLyric(0);
    }
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.url : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  get duration(): number {
    return this.currentSong ? this.currentSong.dt / 1000 : null;
  }

  public onDeleteSong(song: Song): void {
    this.batchActionsService.deleteSong(song);
  }

  public onClearSong(): void {
    this.nzModelService.confirm({
      nzTitle: 'confirm remove playlist',
      nzOnOk: () => {
        this.batchActionsService.clearSong();
      }
    })
  }

}
