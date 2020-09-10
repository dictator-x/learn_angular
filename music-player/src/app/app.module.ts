import { NgModule } from '@angular/core';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
