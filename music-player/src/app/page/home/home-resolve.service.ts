import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, forkJoin } from 'rxjs'
import { first } from 'rxjs/internal/operators'

import { HomeService } from 'src/app/service/home.service';
import { SingerService } from 'src/app/service/singer.service';
import type {
  Banner,
  HotTag,
  SongSheet,
  Singer
} from 'src/app/data-types/common.types';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]]
@Injectable(
)
export class HomeResolverService implements Resolve<HomeDataType> {

  constructor(
    private homeService: HomeService,
    private singerService: SingerService,
  ){}

  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger(),
    ]).pipe(first());
  }
}
