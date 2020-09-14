import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit {

  public progressBarOffset: number = 35;
  public bufferProgressBarOffset: number = 70;

  constructor() { }

  ngOnInit(): void {
  }

}
