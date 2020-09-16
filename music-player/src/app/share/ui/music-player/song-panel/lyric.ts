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

export class LyricProcessor {
  public lrc: Lyric;
  public formattedLines: LyricLine[];

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
}
