import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  @Input() title: string;
  @Input() msg: string;
  @Input() run: () => void;

  ngOnInit(): void {
  }

  public getParentRun() {
    this.run();
  }
}
