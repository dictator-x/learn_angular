import { Component, OnInit } from '@angular/core';

import { StorageService } from '../../services/storage.service'

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.less']
})
export class TodolistComponent implements OnInit {

  public keyword: string = '';
  public todolist: any[] = [];

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
  }

  public doAdd(event: any): void {
    if ( event.keyCode == 13 ) {
      if ( ! this.hasKeyword(this.todolist, this.keyword) ) {
        this.todolist.push({
          title: this.keyword,
          status: 0
        });
      }
      this.keyword = '';
    }
  }

  public delete(idx: number):void {
    this.todolist.splice(idx, 1);
  }

  private hasKeyword(todoList: any[], keyword: string): boolean {
    for ( let todo of todoList ) {
      if ( todo.title === keyword ) {
        return true;
      }
    }
    return false;
  }
}
