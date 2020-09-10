import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {

  public title: string = "Messi Leave BC";
  public content: string = "<h1>Jordan</h1>";
  public food: string[] = ['apple', 'banana', 'pineapple']
  public club: any = {
    location: 'Span'
  }

  constructor() {
    console.log(arguments)
  }

  ngOnInit(): void {
    console.log('News OnInit');
  }

  public sayHello() {
    return 'Hello';
  }

}
