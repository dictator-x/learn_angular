import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  public title: string = "This is Main";
  public msg: string = "Main msg";
  public flag: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  public run(): void {
    console.log(this.flag);
  }

}
