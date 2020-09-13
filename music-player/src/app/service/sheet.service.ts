import { Injectable, Inject } from '@angular/core';
import type { Observable } from 'rxjs';
import {
  map,
  pluck,
  switchMap
} from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

import { ServiceModule, API_CONFIG } from './service.module';
import { SongService } from './song.service'
import type {
  SongSheet,
  Song
} from '../data-types/common.types';

@Injectable({
  providedIn: ServiceModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    private songService: SongService,
    @Inject(API_CONFIG) private host: string
  ){}

  public getSongSheetDetail(id: number): Observable<SongSheet> {
    return this.http.get(`${this.host}/playlist/detail`, { params:{id: ''+id} })
    .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  public playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'), switchMap(tracks => this.songService.getSongList(tracks)));
  }
}
