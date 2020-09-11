import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import type { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit {

  @Input() public activeIndex: number = 0;
  @Output() public changeSlide: EventEmitter<'pre'|'next'> = new EventEmitter<'pre'|'next'>();

  @ViewChild('dot', { static: true }) public dotRef: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

  public onChangeSlide(direction: 'pre'|'next'): void {
    this.changeSlide.emit(direction);
  }

}
