import { getRandomInt } from './number';

export function getElementOffset(el: HTMLElement): { top: number, left: number } {
  if ( ! el.getClientRects().length ) {
    return { top: 0, left: 0 }
  }
  const rect = el.getBoundingClientRect();
  const win = el.ownerDocument.defaultView;

  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  }
}

export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();
  for ( let i = 0 ; i < result.length; i++ ) {
    const j: number = getRandomInt([0, i]);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
