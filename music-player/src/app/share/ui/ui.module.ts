import { NgModule } from '@angular/core';

import { SongCardComponent } from './song-card/song-card.component';
import { CountNumberFormatterPipe } from '../pipe/count-number-formatter.pipe'
import { MusicPlayerModule } from './music-player/music-player.module'



@NgModule({
  declarations: [
    SongCardComponent,
    CountNumberFormatterPipe
  ],
  imports: [
  ],
  exports: [
    SongCardComponent,
    MusicPlayerModule
  ]
})
export class UiModule { }
