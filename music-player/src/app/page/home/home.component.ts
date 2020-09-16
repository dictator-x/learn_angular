import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';

import { AppStoreModule } from 'src/app/store';
import { SheetService } from 'src/app/service/sheet.service';
import { setPlayList, setSongList, setCurrentIndex } from 'src/app/store/actions/player.actions';
import { select } from '@ngrx/store';
import { getPlayerState } from 'src/app/store/selectors/player.selector';

import type {
  Banner,
  HotTag,
  SongSheet,
  Singer,
} from 'src/app/data-types/common.types';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { shuffle, findIndex } from 'src/app/util/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public banners: Banner[] = [];
  public hotTags: HotTag[] = [];
  public songSheets: SongSheet[] = [];
  public singers: Singer[] = [];
  public carouselActiveIndex: number = 0;

  private playerState: PlayState;

  @ViewChild(NzCarouselComponent, {static: true})
  private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store: Store<AppStoreModule>
  ){}

  ngOnInit(): void {
    this.route.data
      .pipe(
        map(res => res.homeDatas)
      ).subscribe(([banners, hotTags, songSheets, singers]) => {
        this.banners = banners;
        this.hotTags = hotTags;
        this.songSheets = songSheets;
        this.singers = singers;
      }
    );

    this.store.pipe(select(getPlayerState)).subscribe((res: PlayState) => this.playerState = res);
  }

  public onBeforeChange(event: any): void {
    const { to } = event;
    this.carouselActiveIndex = to;
  }

  public onChangeSlide(type: string): void {
    this.nzCarousel[type]();
  }

  public onPlay(id: number): void {
    this.sheetService.playSheet(id)
    .subscribe((list) => {
      this.store.dispatch(setSongList({ songList: list }));

      let index = 0;
      let tmpList = list.slice();

      if ( this.playerState.playMode.type === 'random' ) {
        tmpList = shuffle(list || []);
        index = findIndex(tmpList, list[index])
      }

      this.store.dispatch(setPlayList({ playList: tmpList }));
      this.store.dispatch(setCurrentIndex({ currentIndex: index }));
    });
  }
}
