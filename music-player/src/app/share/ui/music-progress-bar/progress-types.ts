import { Observable } from 'rxjs'

export type ProgressBarStyle = {
  width?: string | null;
  height?: string | null;
  left?: string | null;
  bottom?: string | null;
}

export type ProgressEventObserverConfig = {
  start: string;
  move: string;
  end: string;
  filter: (e: Event) => boolean;
  pluckKey: string[];
  startPlucked$?: Observable<number>;
  moveResolved$?: Observable<number>;
  end$?: Observable<Event>;
}

export type ProgressBarOffset = number | null;
