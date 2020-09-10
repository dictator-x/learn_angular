import { Component, OnInit } from '@angular/core';

import { StorageService } from '../../services/storage.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  public todoLists: string[] = [];
  public keyword: string = ''

  constructor(private storage: StorageService) {

  }

  ngOnInit(): void {
    let searchList: any = this.storage.get('searchList');
    if ( searchList ) {
      this.todoLists = searchList;
    }
  }

  public handleSearch(): void {
    if ( this.keyword != '' && this.todoLists.indexOf(this.keyword) == -1 ) {
      this.todoLists.push(this.keyword);
      this.storage.set('searchList', this.todoLists);
    }
    this.keyword = '';
  }

  public removeKey(idx: number): void {
    this.todoLists.splice(idx, 1)
      this.storage.set('searchList', this.todoLists);
  }

}
