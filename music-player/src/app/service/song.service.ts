import { Injectable, Inject } from '@angular/core';
import type { Observable } from 'rxjs';
import {
  map,
} from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

import { ServiceModule, API_CONFIG } from './service.module';
import type {
  SongUrl,
  Song,
  Lyric
} from '../data-types/common.types';

@Injectable({
  providedIn: ServiceModule
})
export class SongService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private host: string
  ){}

  public getSongUrl(ids: string): Observable<SongUrl[]> {
    return this.http.get(`${this.host}/song/url`, { params:{id: ids} })
    .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  // public getSongList(songs: Song | Song[]): Observable<Song[]> {
  //   const songArr: Song[] = Array.isArray(songs) ? songs.slice() : [songs];
  //   const ids = songArr.map(item => item.id).join(',');
  //   return Observable.create(observer => {
  //     this.getSongUrl(ids).subscribe(urls => {
  //       observer.next(this.prepareSongList(songArr, urls));
  //     });
  //   });
  // }

  public getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr: Song[] = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls => {
      return this.prepareSongList(songArr, urls);
    }));
  }

  private prepareSongList(songArr: Song[], urls: SongUrl[]): Song[] {
    return songArr.reduce<Song[]>((acc: Song[], song: Song): Song[] => {
      const url = urls.find(url => url.id === song.id).url;
      if ( url ) {
        acc.push({...song, url});
      }
      return acc;
    }, []);
  }

  public getLyric(id: number): Observable<Lyric> {
    return this.http.get(`${this.host}/lyric`, { params:{id: id.toString()} })
    .pipe(map((res: { [key: string]: { lyric: string; } }) => {
      if ( res.nolyric ) return null;
      return {
        lyric: res.lrc.lyric,
        tlyric: res.tlyric.lyric
      }
    }));
  }
}
