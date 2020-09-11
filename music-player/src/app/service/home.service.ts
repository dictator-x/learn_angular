import { Injectable, Inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

import { ServiceModule, API_CONFIG } from './service.module';
import type { Banner } from '../data-types/common.types';

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
}
