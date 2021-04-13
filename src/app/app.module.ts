import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialsModule } from './common/shared/angular-materials.module';

// import { StudyTableComponent } from './webviewer-main/study-table/study-table.component';
import { WebviewerMainModule } from './webviewer-main/webviewer-main.module';
import { GraphQLModule } from './graphql.module';

import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';

import { CommonDialogComponent } from './common/dialog/common-dialog.component';

import { CookieService } from 'ngx-cookie-service';

export function tokenGetter(){
    return localStorage.getItem('token')
}

@NgModule({
    declarations: [
        AppComponent,
        SigninComponent,
        CommonDialogComponent
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
        JwtModule.forRoot({
            config:{
                tokenGetter: tokenGetter,
                allowedDomains: ['localhost:3000', 'localhost:3000/grpahql'],
                disallowedRoutes: []
            }
        }),
        NgxsModule.forRoot([], {
            developmentMode: !environment.production
        })
      
    ],
    bootstrap: [AppComponent],
    exports: [
        SigninComponent
    ],
    providers:[CookieService]
})
export class AppModule {}
