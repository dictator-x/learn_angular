import { NgModule } from '@angular/core';

import { SongCardComponent } from './song-card/song-card.component';
import { CountNumberFormatterPipe } from '../pipe/count-number-formatter.pipe'



@NgModule({
  declarations: [
    SongCardComponent,
    CountNumberFormatterPipe
  ],
  imports: [
  ],
  exports: [
  ]
})
export class UiModule { }
