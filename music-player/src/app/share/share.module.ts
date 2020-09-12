import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UiModule } from './ui/ui.module';


@NgModule({
  declarations: [
  ],
  imports: [
    // CommonModule,
    // FormsModule,
    // NgZorroAntdModule,
    // UiModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    UiModule
  ]
})
export class ShareModule { }
