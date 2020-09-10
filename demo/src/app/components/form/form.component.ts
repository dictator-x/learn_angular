import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {

  public peopleInfo: any = {
    username: '',
    gender: '1',
    cities: ['Vancouver', 'Toronto', 'Regina'],
    city: 'Vancouver',
    hobbies: [
      {
        title: 'Swimming',
        checked: false
      },
      {
        title: 'Coding',
        checked: false
      },
      {
        title: 'Sleeping',
        checked: true
      }
    ],
    mark: ''
  }

  constructor() { }

  ngOnInit(): void {
  }

  public doSubmit(): void {
    console.log(this.peopleInfo);
  }

}
