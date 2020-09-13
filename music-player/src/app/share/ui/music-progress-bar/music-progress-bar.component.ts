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

  private findClosestValue(position: number): number {
    return 1;
  }
}
