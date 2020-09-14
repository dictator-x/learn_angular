import { createReducer, on, Action } from '@ngrx/store';

import { PlayMode } from 'src/app/share/ui/music-player/player.types';
import { Song } from 'src/app/data-types/common.types';
import {
  setPlaying,
  setPlayList,
  setSongList,
  setPlayMode,
  setCurrentIndex
} from '../actions/player.actions'

export type PlayState = {
  playing: boolean;
  playMode: PlayMode;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
}

export const initialState: PlayState = {
  playing: false,
  songList: [],
  playList:  [],
  playMode: { type: 'loop', label: 'loop' },
  currentIndex:  -1
}

const reducer = createReducer(
  initialState,
  on(setPlaying, (state, { playing }) => ({ ...state, playing })),
  on(setPlayList, (state, { playList }) => ({ ...state, playList })),
  on(setSongList, (state, { songList }) => ({ ...state, songList })),
  on(setPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(setCurrentIndex, (state, { index }) => ({ ...state, index }))
);

export function playReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
