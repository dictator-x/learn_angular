import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
  Inject
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

import { ProgressEventObserverConfig } from './progress-types'
import { clearEventDefaultAndPropoagation } from './progress-bar-util'
import { getElementOffset } from 'src/app/util/array'

@Component({
  selector: 'app-music-progress-bar',
  template: `
    <div class="progress-bar" #progressBar>
      <app-music-progress-track></app-music-progress-track>
      <app-music-progress-handle></app-music-progress-handle>
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

  private progressDom: HTMLDivElement;
  @ViewChild('progressBar', {static: true}) private progressBar;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(
    @Inject(DOCUMENT) private doc: Document
  ){}

  ngOnInit(): void {
    // Hook gragging callback on DOM.
    this.createGraggingObservables();
    this.subscribeDrag();
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

  private onDragStart(value: number) {
    console.log(value)
  }

  private onDragMove(value: number) {
    // console.log(value)
  }

  private onDragEnd(e: Event) {
    // console.log(e)
  }

  private findClosestValue(position: number): number {
    // length of progress bar.
    const progressBarLength = this.getProgeessBarLength();

    const progressStart = this.getProgressBarStartPostion();

    const ratioTmp = (position - progressStart) / progressBarLength
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
