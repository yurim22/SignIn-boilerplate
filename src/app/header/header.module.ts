import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header.component';
import { ToolbarUsersComponent } from './toolbar/toolbar-users/toolbar-users.component';
import { ToolbarAboutComponent } from './toolbar/toolbar-about/toolbar-about.component';
import { ToolbarLogoutComponent } from './toolbar/toolbar-logout/toolbar-logout.component';
// import { ToolbarPacsComponent } from '../toolbar/toolbar-pacs';

import { AngularMaterialsModule } from '../common/shared/angular-materials.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersDialogComponent } from './toolbar/toolbar-users/users-dialog/users-dialog.component';
import { CreateNewUserDialogComponent } from './toolbar/toolbar-users/users-dialog/new-user-dialog.component';

@NgModule({
    declarations: [
        HeaderComponent,
        ToolbarUsersComponent,
        ToolbarAboutComponent,
        ToolbarLogoutComponent, UsersDialogComponent, CreateNewUserDialogComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
    ],
    exports: [HeaderComponent, FormsModule, ReactiveFormsModule]
})
export class HeaderModule { }
