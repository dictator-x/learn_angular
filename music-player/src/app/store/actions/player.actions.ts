import { createAction, props } from '@ngrx/store';

import { Song } from 'src/app/data-types/common.types';
import { PlayMode } from 'src/app/share/ui/music-player/player.types';

export const setPlaying = createAction('[Player] Set playing', props<{ playing: boolean }>());
export const setPlayList = createAction('[Player] Set playList', props<{ playList: Song[] }>());
export const setSongList = createAction('[Player] Set songList', props<{ songList: Song[] }>());
export const setPlayMode = createAction('[Player] Set playMode', props<{ playMode: PlayMode }>());
export const setCurrentIndex = createAction('[Player] Set currentIndex', props<{ currentIndex: number }>());
