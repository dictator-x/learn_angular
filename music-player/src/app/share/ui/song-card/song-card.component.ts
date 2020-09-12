import { Component, OnInit, Input } from '@angular/core';

import { SongSheet } from 'src/app/data-types/common.types'

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.less']
})
export class SongCardComponent implements OnInit {

  @Input() public song: SongSheet;

  constructor() { }

  ngOnInit(): void {
  }

}
