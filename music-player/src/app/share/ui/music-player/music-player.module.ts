import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicPlayerComponent } from './music-player.component';
import { CommonModule } from '@angular/common';

import { MusicProgressBarModule } from '../music-progress-bar/music-progress-bar.module'
import { FormatTimePipe } from '../../pipe/format-time.pipe';
import { SongPanelComponent } from './song-panel/song-panel.component';
import { ScrollComponent } from './scroll/scroll.component'
import { ClickoutsideDirective } from '../../directive/clickoutside.directive'

@NgModule({
  declarations: [
    MusicPlayerComponent,
    FormatTimePipe,
    SongPanelComponent,
    ScrollComponent,
    ClickoutsideDirective
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
