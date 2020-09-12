import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { SongSheet } from 'src/app/data-types/common.types'

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongCardComponent implements OnInit {

  @Input() public song: SongSheet;

  constructor() { }

  ngOnInit(): void {
  }

}
