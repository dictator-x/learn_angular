import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsComponent } from './components/news/news.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FormComponent } from './components/form/form.component';
import { SearchComponent } from './components/search/search.component';
import { TodolistComponent } from './components/todolist/todolist.component';

import { StorageService } from './services/storage.service';
import { RequestService } from './services/request.service';
import { DomComponent } from './components/dom/dom.component';
import { TransitionComponent } from './components/transition/transition.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { RequestComponent } from './components/request/request.component';
import { JordanComponent } from './components/jordan/jordan.component';
import { KobeComponent } from './components/kobe/kobe.component';
import { MessiComponent } from './components/messi/messi.component'

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    HomeComponent,
    HeaderComponent,
    FormComponent,
    SearchComponent,
    TodolistComponent,
    DomComponent,
    TransitionComponent,
    FooterComponent,
    MainComponent,
    RequestComponent,
    JordanComponent,
    KobeComponent,
    MessiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    StorageService,
    RequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
