import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

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
