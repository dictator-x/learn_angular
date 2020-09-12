import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';

import { HomeService } from 'src/app/service/home.service';
import type {
  Banner,
  HotTag,
  SongSheet
} from 'src/app/data-types/common.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public banners: Banner[] = [];
  public hotTags: HotTag[] = [];
  public songSheets: SongSheet[] = [];
  public carouselActiveIndex: number = 0;

  @ViewChild(NzCarouselComponent, {static: true})
  private nzCarousel: NzCarouselComponent;

  constructor(
    private homeService: HomeService
  ){}

  ngOnInit(): void {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    });
    this.homeService.getHotTags().subscribe(tags => {
      this.hotTags = tags;
    })
    this.homeService.getPersonalSheetList().subscribe(result => {
      this.songSheets = result;
    })
  }

  public onBeforeChange(event: any): void {
    const { to } = event;
    this.carouselActiveIndex = to;
  }

  public onChangeSlide(type: string): void {
    this.nzCarousel[type]();
  }
}
