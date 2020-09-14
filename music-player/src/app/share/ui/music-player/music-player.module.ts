import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicPlayerComponent } from './music-player.component';

import { MusicProgressBarModule } from '../music-progress-bar/music-progress-bar.module'



@NgModule({
  declarations: [
    MusicPlayerComponent
  ],
  imports: [
    MusicProgressBarModule,
    FormsModule
  ],
  exports: [
    MusicPlayerComponent
  ]
})
export class MusicPlayerModule { }
