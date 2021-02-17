import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialsModule } from './common/shared/angular-materials.module';

// import { StudyTableComponent } from './webviewer-main/study-table/study-table.component';
import { WebviewerMainModule } from './webviewer-main/webviewer-main.module';

@NgModule({
    declarations: [
        AppComponent,
        SigninComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        WebviewerMainModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [
        SigninComponent
    ]
})
export class AppModule { }
