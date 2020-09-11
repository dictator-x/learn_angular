import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jordan',
  templateUrl: './jordan.component.html',
  styleUrls: ['./jordan.component.less']
})
export class JordanComponent implements OnInit {

  public list: any[] = [1,2,3,4,5,6];

  constructor() { }

  ngOnInit(): void {
  }

}
