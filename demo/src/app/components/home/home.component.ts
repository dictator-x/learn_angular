import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public imageUrl: string = 'https://miro.medium.com/max/1400/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'
  public list: any[] = [
    {
      "title": 'new1'
    },
    {
      "title": 'new2'
    },
    {
      "title": 'new3'
    }
  ]
  public flag: boolean = false
  public keywords: string = 'aa';

  public handleClick(event: any): void {
    console.log(event.target)
    console.log(event)
    console.log('aaa')
  }

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {this.flag = true}, 2000)
  }

}
