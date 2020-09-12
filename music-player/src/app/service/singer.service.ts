import { Injectable, Inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

import { ServiceModule, API_CONFIG } from './service.module';
import type {
  Singer
} from '../data-types/common.types';

type SingerParams = {
  offset: string;
  limit: string;
  cat?: string;
}

const defaultParams:SingerParams = {
  offset: '0',
  limit: '9',
  cat: '5001'
}

@Injectable({
  providedIn: ServiceModule
})
export class SingerService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private host: string
  ){}

  public getEnterSinger(params: SingerParams = defaultParams): Observable<Singer[]> {
    return this.http.get(`${this.host}/artist/list`, { params })
    .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
