import { Component, OnInit, ViewChild } from '@angular/core';
import type { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.less']
})
export class CarouselComponent implements OnInit {

  @ViewChild('dot', { static: true }) public dotRef: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
