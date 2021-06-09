import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { CommonDialogComponent } from './common/dialog/common-dialog.component';
import { WebviewerMainModule } from './webviewer-main/webviewer-main.module';

import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularMaterialsModule } from './common/shared/angular-materials.module';
import { NgxsModule } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import {NgxsSelectSnapshotModule} from '@ngxs-labs/select-snapshot';
// import { GraphQLModule } from './graphql.module';

import { AuthInterceptor } from './signin/auth/auth-interceptor.service';
import { GlobalErrorHandlerService } from './common/error/global-error-handler.service';
import { StudyState } from './store/study/study.state';
import { AccountComponent } from './account/account.component';
import { CurrentUserState } from './store/users/users.state';
import { CornerstoneService } from './webviewer-main/cornerstone/cornerstone.service';
import { environment } from 'src/environments/environment';

export function tokenGetter(): string {
    return localStorage.getItem('token');
}

@NgModule({
    declarations: [
        AppComponent,
        SigninComponent,
        CommonDialogComponent,
        AccountComponent
    ],
    imports: [
        // GraphQLModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        WebviewerMainModule,
        // Any requests sent using Angular's HttpClient will automatically have a token attached as an Authorization header. => tokengetter
        // cf) https://github.com/auth0/angular2-jwt
        JwtModule.forRoot({
            config: {
                tokenGetter,
                allowedDomains: ['localhost:3000', 'localhost:3000/api'],
                disallowedRoutes: [],
                skipWhenExpired: true,
            }
        }),
        NgxsModule.forRoot([
            StudyState,
            CurrentUserState
        ],
            {developmentMode: !environment.production}
        ),
        NgxsSelectSnapshotModule.forRoot(),
    ],
    bootstrap: [AppComponent],
    exports: [
        SigninComponent,
        // HighlightDirective
    ],
    providers:
      [
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: HttpInterceptorService,
        //     multi: true
        // },
        GlobalErrorHandlerService,
        {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
        CornerstoneService
    ]
})
export class AppModule {}
