import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialsModule } from './common/shared/angular-materials.module';
import { WebviewerMainComponent } from './webviewer-main/webviewer-main.component';
import { StudyTableComponent } from './webviewer-main/study-table/study-table.component';
import { HeaderComponent } from './webviewer-main/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    WebviewerMainComponent,
    StudyTableComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
