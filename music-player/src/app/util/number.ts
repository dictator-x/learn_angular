export function boundNumberInRange(val: number, l: number, h: number): number {
  return Math.max(Math.min(val, h), l);
}

export function getPercent(val: number, min: number, max: number): number {
  return ( val - min ) / ( max - min ) * 100;
}

export function assertNumber(value: number): boolean {
  return ! isNaN(typeof value !== 'number' ? parseFloat(value) : value);
}

export function getRandomInt(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1));
}
