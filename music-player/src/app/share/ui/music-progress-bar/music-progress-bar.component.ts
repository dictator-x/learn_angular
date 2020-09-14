import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
  Inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  fromEvent,
  merge,
  Observable
} from 'rxjs';

import {
  tap,
  map,
  pluck,
  filter,
  takeUntil,
  distinctUntilChanged
} from 'rxjs/internal/operators';

import { DOCUMENT } from '@angular/common';

import {
  ProgressEventObserverConfig,
  ProgressBarOffset
} from './progress-types'
import { clearEventDefaultAndPropoagation } from './progress-bar-util'
import { getElementOffset } from 'src/app/util/array'
import { boundNumberInRange, getPercent } from 'src/app/util/number'

@Component({
  selector: 'app-music-progress-bar',
  template: `
    <div class="progress-bar" #progressBar>
      <app-music-progress-track [isVertical]="isVertical" [length]="progressBarOffset"></app-music-progress-track>
      <app-music-progress-handle [isVertical]="isVertical" [offset]="progressBarOffset"></app-music-progress-handle>
    </div>
  `,
  styleUrls: ['./music-progress-bar.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicProgressBarComponent implements OnInit {

  @Input() isVertical = false;
  @Input() min: number = 0;
  @Input() max: number = 100;

  @ViewChild('progressBar', {static: true}) private progressBar;

  private progressDom: HTMLDivElement;
  private isDragging = false;
  public progressBarOffset: ProgressBarOffset = 0;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    // Hook gragging callback on DOM.
    this.createGraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createGraggingObservables(): void {

    const direction = this.isVertical ? 'pageY' : 'pageX';

    const mouse: ProgressEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent): boolean => e instanceof MouseEvent,
      pluckKey: [direction]
    };

    const touch: ProgressEventObserverConfig = {
      start: 'touchdown',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent): boolean => e instanceof TouchEvent,
      pluckKey: ['touches', '0', direction]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source;

      source.startPlucked$ = fromEvent(this.progressBar.nativeElement, start).pipe(
        filter(filterFunc),
        tap(clearEventDefaultAndPropoagation),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filterFunc),
        tap(clearEventDefaultAndPropoagation),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if ( events.indexOf('start') !== -1 && this.dragStart$ ) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if ( events.indexOf('move') !== -1 && this.dragMove$ ) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if ( events.indexOf('end') !== -1 && this.dragEnd$ ) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number): void {
    this.toggleDragMoving(true);
    this.updateTrackerAndHandler(value);
  }

  private onDragMove(value: number) {
    if ( this.isDragging ) {
      this.updateTrackerAndHandler(value)
    }
  }

  private onDragEnd(e: Event) {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private updateTrackerAndHandler(value: ProgressBarOffset): void {
    this.progressBarOffset = this.getValueToOffset(value);
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: ProgressBarOffset): ProgressBarOffset {
    return getPercent(value, this.min, this.max);
  }

  private toggleDragMoving(movable: boolean): void {
    this.isDragging = movable;
    if ( movable ) {
      this.subscribeDrag(['move', 'end']);
    } else {
      // this.unSubscribeDrag(['move', 'end']);
    }
  }

  private findClosestValue(position: number): number {
    // length of progress bar.
    const progressBarLength = this.getProgeessBarLength();
    const progressStart = this.getProgressBarStartPostion();
    const ratioTmp = boundNumberInRange((position-progressStart)/progressBarLength, 0, 1);

    const ratio = this.isVertical ? 1 - ratioTmp : ratioTmp;
    return ratio * ( this.max - this.min ) + this.min;
  }

  private getProgeessBarLength(): number {
    return this.isVertical ?
      this.progressBar.nativeElement.clientHeight :
      this.progressBar.nativeElement.clientWidth;
  }

  private getProgressBarStartPostion(): number {
    const offset = getElementOffset(this.progressBar.nativeElement);
    return this.isVertical ? offset.top : offset.left;
  }
}
