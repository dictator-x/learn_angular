import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'



@NgModule({
  declarations: [],
  imports: [
    CommonModule
    FormsModule,
    NgZorroAntdModule
  ],
  export: [
    FormsModule,
    NgZorroAntdModule
  ]
})
export class ShareModule { }
