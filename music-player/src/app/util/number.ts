export function boundNumberInRange(val: number, l: number, h: number): number {
  return Math.max(Math.min(val, h), l);
}

export function getPercent(val: number, min: number, max: number): number {
  return ( val - min ) / ( max - min ) * 100;
}
