import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.less']
})
export class TransitionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public showAside(): void {
    const asideDom: any = document.getElementById('aside');
    asideDom.style.transform="translate(0,0)"
  }

  public hideAside(): void {
    const asideDom: any = document.getElementById('aside');
    asideDom.style.transform="translate(100%,0)"
  }
}
