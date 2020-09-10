import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import { RequestService } from '../../services/request.service'

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.less']
})
export class RequestComponent implements OnInit {

  constructor(private request: RequestService) { }

  ngOnInit(): void {
    this.request.getData();

    this.request.getCallbackData()
      .then((data) => console.log(data));

    const stream: Observable<string> = this.request.getRxjsData();
    const subscriber = stream.subscribe((data) => {
      console.log(data);
    });
    // setTimeout(() => {
    //   subscriber.unsubscribe();
    // }, 1000)
  }

}
