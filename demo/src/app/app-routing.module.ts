import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessiComponent } from '../app/components/messi/messi.component'
import { JordanComponent } from '../app/components/jordan/jordan.component'
import { KobeComponent } from '../app/components/kobe/kobe.component'

const routes: Routes = [
  { path: 'jordan', component: JordanComponent },
  { path: 'kobe', component: KobeComponent },
  { path: 'messi/:id', component: MessiComponent },
  {
    path: '',
    redirectTo: '/jordan',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
