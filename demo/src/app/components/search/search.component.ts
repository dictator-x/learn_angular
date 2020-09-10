import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  public todoLists: string[] = []
  public keyword: string = ''

  constructor() { }

  ngOnInit(): void {
  }

  public handleSearch(): void {
    if ( this.todoLists.indexOf(this.keyword) == -1 ) {
      this.todoLists.push(this.keyword)
    }
    this.keyword = ''
  }

  public removeKey(idx: number): void {
    this.todoLists.splice(idx, 1)
  }

}
