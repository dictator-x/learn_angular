import { NgModule } from '@angular/core';
import { MusicProgressBarComponent } from './music-progress-bar.component';
import { MusicProgressTrackComponent } from './music-progress-track.component';
import { MusicProgressHandleComponent } from './music-progress-handle.component';

@NgModule({
  declarations: [
    MusicProgressBarComponent,
    MusicProgressTrackComponent,
    MusicProgressHandleComponent
  ],
  imports: [
  ],
  exports: [
    MusicProgressBarComponent
  ]
})
export class MusicProgressBarModule { }
