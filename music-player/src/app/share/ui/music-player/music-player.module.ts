import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicPlayerComponent } from './music-player.component';
import { CommonModule } from '@angular/common';

import { MusicProgressBarModule } from '../music-progress-bar/music-progress-bar.module'
import { FormatTimePipe } from '../../pipe/format-time.pipe'

@NgModule({
  declarations: [
    MusicPlayerComponent,
    FormatTimePipe
  ],
  imports: [
    MusicProgressBarModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    MusicPlayerComponent
  ]
})
export class MusicPlayerModule { }
