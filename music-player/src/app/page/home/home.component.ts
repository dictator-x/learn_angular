import { Component, OnInit } from '@angular/core';

import { HomeService } from 'src/app/service/home.service';
import type { Banner } from 'src/app/data-types/common.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public banners: Banner[] = [];

  constructor(
    private homeService: HomeService
  ){}

  ngOnInit(): void {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

}
