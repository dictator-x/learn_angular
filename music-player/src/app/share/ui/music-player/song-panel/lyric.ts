import { timer, Subject, Subscription } from 'rxjs';

import { Lyric } from 'src/app/data-types/common.types'

const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export interface BaseLyricLine {
  originalTxt: string;
  bilingualTxt: string;

}

interface LyricLine extends BaseLyricLine {
  time: number;
  timeLiteral: string;
}

interface Handler extends BaseLyricLine {
  lineNum: number;
}

export class LyricProcessor {
  public lrc: Lyric;
  public formattedLines: LyricLine[];

  private playing: boolean = false;
  private curNum: number;
  private startStamp: number;
  private pauseStamp: number;
  private timer$: Subscription;

  public handler = new Subject<Handler>();

  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }

  private init(): void {
    if ( this.lrc.tlyric ) {
      this.genBilingualLyric();
    } else {
      this.genLyric();
    }
  }

  private genLyric(): void {
    const lines = this.lrc.lyric.split('\n');
    this.formattedLines = lines.reduce((acc, line) => {
      const formattedLine = this.formatLine(line);
      formattedLine ? acc.push(formattedLine) : acc;
      return acc;
    }, []);
  }

  private genBilingualLyric(): void {
    const lines = this.lrc.lyric.split('\n');
    const bilingualLines = this.lrc.tlyric.split('\n');
    //Cache and formatted bilingualline
    const tmp: {[key: string]: string} = bilingualLines.reduce((acc, line) => {
      const result = timeExp.exec(line);
      if ( result ) {
        acc[result[0]] = line.replace(timeExp, '').trim();
      }
      return acc;
    }, {})

    this.formattedLines = lines.reduce((acc, line) => {
      const formattedLine = this.formatLine(line);
      if ( formattedLine ) {
        if ( tmp[formattedLine.timeLiteral] ) {
          formattedLine.bilingualTxt = tmp[formattedLine.timeLiteral];
        }
        acc.push(formattedLine);
      }
      return acc;
    }, []);
  }

  private formatLine(line: string): LyricLine {
    const result = timeExp.exec(line);
    if ( result ) {
      const originalTxt = line.replace(timeExp, '').trim();
      const bilingualTxt = null;
      if ( originalTxt ) {
        const secondCount = result[3] || '00';
        const len = secondCount.length;
        const _secondCount = len > 2 ? parseInt(secondCount) : parseInt(secondCount) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2])* 1000 + _secondCount;
        return { originalTxt, bilingualTxt, time, timeLiteral: result[0] };
      }
    }
    return null;
  }

  //TODO: rework on this.
  public play(startTime=0, skip = false) {
    if ( ! this.formattedLines.length ) return;
    if ( ! this.playing ) {
      this.playing = true;
    }

    this.curNum = this.findCurNum(startTime);
    this.startStamp = Date.now() - startTime;
    if ( ! skip ) {
      this.callHandler(this.curNum-1);
    }

    if ( this.curNum < this.formattedLines.length ) {
      this.clearTimer();
      this.playReset();
    }
  }

  private clearTimer() {
    this.timer$ && this.timer$.unsubscribe();
    this.timer$ = null;
  }
  private playReset() {
    let line = this.formattedLines[this.curNum];
    const delay = line.time - (Date.now() - this.startStamp);
    this.timer$ = timer(delay).subscribe(()=> {
      this.callHandler(this.curNum++);
      if ( this.curNum < this.formattedLines.length && this.playing) {
        this.playReset();
      }
    });
  }

  private callHandler(i: number):void {
    if ( i > 0 ) {
      this.handler.next({
        originalTxt: this.formattedLines[i].originalTxt,
        bilingualTxt: this.formattedLines[i].bilingualTxt,
        lineNum: i
      });
    }
  }

  private findCurNum(time: number): number {
    const index = this.formattedLines.findIndex(line => time <= line.time);
    return index === -1 ? this.formattedLines.length - 1 : index;
  }

  public togglePlay(playing: boolean): void {
    const now = Date.now();
    this.playing = playing;
    if ( playing ) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now);
      this.play(startTime, true);
    } else {
      this.stop();
      this.pauseStamp = now;
    }
  }

  public stop() : void {
    if ( this.playing ) {
      this.playing = false;
    }
    this.clearTimer();
  }

  public seek(time: number): void {
    this.play(time);
  }
}
