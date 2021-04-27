import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { WebviewerMainComponent } from './webviewer-main/webviewer-main.component';
import { AngularMaterialsModule } from './common/shared/angular-materials.module';
import { AuthGuard } from './signin/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
    },
    {
        path: 'signin',
        component: SigninComponent
    },
    {
        path: 'webviewer',
        component: WebviewerMainComponent,
        canActivate: [AuthGuard],
        data: { title: "webviewer", subtitle: 'JWT Authentication'}
    }
];

@NgModule({
    imports: [BrowserModule, FormsModule, AngularMaterialsModule, RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    // declarations:[
    //     SigninComponent,
    //     WebviewerMainComponent
    // ]
})
export class AppRoutingModule { }
