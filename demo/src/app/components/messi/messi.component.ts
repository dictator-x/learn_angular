import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-messi',
  templateUrl: './messi.component.html',
  styleUrls: ['./messi.component.less']
})
export class MessiComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data)=>{
      console.log(data)
    })
    this.route.params.subscribe((data)=>{
      console.log(data)
    })
  }

}
