import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dom',
  templateUrl: './dom.component.html',
  styleUrls: ['./dom.component.less']
})
export class DomComponent implements OnInit {

  public flag: boolean = true;

  @ViewChild('mybox') mybox: any;
  @ViewChild('header') header: any;

  constructor() { }

  ngOnInit(): void {
    let oBox: any = document.getElementById('box');
    console.log(oBox.innerHTML);
    oBox.style.color = 'red';

    // const oBox1: any = document.getElementById('box1');
    // console.log(oBox1.innerHTML);
    // oBox1.style.color = 'blue';
  }

  ngAfterViewInit(): void {
    const oBox1: any = document.getElementById('box1');
    console.log(oBox1.innerHTML);
    oBox1.style.color = 'blue';

    console.log(this.mybox.nativeElement);
    this.mybox.nativeElement.style.width = '200px';
    this.mybox.nativeElement.style.height = '200px';
    this.mybox.nativeElement.style.background = 'red';
  }

  public getChildRun(): void {
    this.header.run();
  }
}
