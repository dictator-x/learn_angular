import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('windowToken');


@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {
      provide: API_CONFIG,
      useValue: 'http://localhost:3000'
    },
    {
      provide: WINDOW,
      useFactory(platformId: Object): Window | Object {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [ PLATFORM_ID ]
    }
  ]
})
export class ServiceModule { }
