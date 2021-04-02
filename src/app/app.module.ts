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
import { GraphQLModule } from './graphql.module';

import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';

@NgModule({
    declarations: [
        AppComponent,
        SigninComponent
    ],
    imports: [
        GraphQLModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        WebviewerMainModule,
    ],
    providers: [
        // {
        //     provide: APOLLO_OPTIONS,
        //     useFactory: (httpLink: HttpLink) => {
        //       return {
        //         cache: new InMemoryCache(),
        //         link: httpLink.create({
        //           uri: 'http://localhost:3000/graphql',
        //         }),
        //       };
        //     },
        //     deps: [HttpLink],
        // }
    ],
    bootstrap: [AppComponent],
    exports: [
        SigninComponent
    ]
})
export class AppModule { }
