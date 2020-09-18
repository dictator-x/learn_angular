import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AppStoreModule } from './index';
import { Song } from 'src/app/data-types/common.types';
import { PlayState } from './reducers/player.reducer';
import {
  setSongList,
  setPlayList,
  setCurrentIndex
} from './actions/player.actions';
import { findIndex } from 'src/app/util/array';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {

  private playerState: PlayState;

  constructor(private store: Store<AppStoreModule>) {
    this.store.pipe(map(state => state['player'])).subscribe((res: PlayState) => this.playerState = res);
  }

  //TODO: check play mode.
  selectPlayList({ list, index }: { list: Song[], index: number }): void {
    this.store.dispatch(setSongList({ songList: list }));
    this.store.dispatch(setPlayList({ playList: list }));
    this.store.dispatch(setCurrentIndex({ currentIndex: 0 }));
  }

  deleteSong(song: Song): void {

    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;

    const songIndex = findIndex(songList, song);
    songList.splice(songIndex, 1);
    const playIndex = findIndex(playList, song);
    playList.splice(playIndex, 1);

    if ( currentIndex >= songIndex ) {
      currentIndex--;
      currentIndex < 0 ? currentIndex = 0 : currentIndex;
    }

    this.store.dispatch(setSongList({ songList }));
    this.store.dispatch(setPlayList({ playList }));
    this.store.dispatch(setCurrentIndex({ currentIndex }));
  }

  clearSong(): void {
    this.store.dispatch(setSongList({ songList:[] }));
    this.store.dispatch(setPlayList({ playList:[] }));
    this.store.dispatch(setCurrentIndex({ currentIndex: -1 }));
  }
}
