import { Injectable, Inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

import { ServiceModule, API_CONFIG } from './service.module';
import type {
  Banner,
  HotTag,
  SongSheet
} from '../data-types/common.types';

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private host: string
  ){}

  public getBanners(): Observable<Banner[]> {
    return this.http.get(`${this.host}/banner`)
    .pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  public getHotTags(): Observable<HotTag[]> {
    return this.http.get(`${this.host}/playlist/hot`)
    .pipe(map((res: { tags: HotTag[] }) => {
      return res.tags.sort((a: HotTag, b: HotTag) => a.position - b.position).slice(0,5);
    }));
  }

  public getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http.get(`${this.host}/personalized`)
    .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0,16)));
  }
}
