import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { timer } from 'rxjs';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel'


@Component({
  selector: 'app-scroll',
  template: `
    <div class="scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
  `
    .scroll {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ScrollComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[];
  @Input() refreshDelay: number = 50;
  @Output() private onScrollEnd = new EventEmitter<number>();
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;

  private bs: BScroll;

  constructor(readonly el: ElementRef) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // console.log(this.wrapRef.nativeElement)
    BScroll.use(ScrollBar);
    BScroll.use(MouseWheel);
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['data'] ) {
      this.refreshScroll();
    }
  }

  private refresh(): void {
    this.bs.refresh();
  }

  public refreshScroll(): void {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh()
    });
  }

  public scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  public scrollTo(...args) {
    this.bs.scrollTo.apply(this.bs, args);
  }
}
