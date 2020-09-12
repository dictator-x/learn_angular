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
  styles: [`
    .carousel{
      padding: 10px 0;
      background-color: #001529;
      .wrap{
        position: relative;
        .dot{
          display: block;
          width: 20px;
          height: 20px;
          overflow: hidden;
          background: url('./banner.png') 3px -343px;
          cursor: pointer;
          &.active{
            background-position: -16px -343px;
          }
        }
        .arrow{
          display: block;
          position: absolute;
          width: 37px;
          top:50%;
          margin-top: -20px;
          color: #fff;
          font-size: 40px;
          cursor: pointer;
          &.left{
            left: -68px;
          }
          &.right{
            right: -68px;
          }
        }
      }
    }
  `],
  template: `
    <div class="carousel">
      <div class="wrap">
        <i nz-icon class="arrow left" nzType="left" nzTheme="outline" (click)="onChangeSlide('pre')"></i>
        <ng-content></ng-content>
        <ng-template #dot let-index>
          <i class="dot" [class.active]="activeIndex === index"></i>
        </ng-template>
        <i nz-icon class="arrow right" nzType="right" nzTheme="outline" (click)="onChangeSlide('next')" ></i>
      </div>
    </div>
  `,
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
