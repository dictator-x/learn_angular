import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-card',
  styleUrls: ['./member-card.component.less'],
  template:`
    <div class="member">
      <div class="login">
        <p>share unlimited music stream</p>
        <button nz-button class="btn">login</button>
      </div>
    </div>
  `
})
export class MemberCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
