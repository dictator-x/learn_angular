import { NgModule } from '@angular/core';
import { MusicPlayerComponent } from './music-player.component';

import { MusicProgressBarModule } from '../music-progress-bar/music-progress-bar.module'



@NgModule({
  declarations: [
    MusicPlayerComponent
  ],
  imports: [
    MusicProgressBarModule
  ],
  exports: [
    MusicPlayerComponent
  ]
})
export class MusicPlayerModule { }
