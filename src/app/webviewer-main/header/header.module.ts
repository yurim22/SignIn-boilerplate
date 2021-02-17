import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header.component';
import { ToolbarPacsComponent } from './toolbar/toolbar-pacs/toolbar-pacs.component';
import { ToolbarUsersComponent } from './toolbar/toolbar-users/toolbar-users.component';
import { ToolbarSettingsComponent } from './toolbar/toolbar-settings/toolbar-settings.component';
import { ToolbarAboutComponent } from './toolbar/toolbar-about/toolbar-about.component';
import { ToolbarLogoutComponent } from './toolbar/toolbar-logout/toolbar-logout.component';
// import { ToolbarPacsComponent } from '../toolbar/toolbar-pacs';

import { AngularMaterialsModule } from '../../common/shared/angular-materials.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
    declarations: [
        HeaderComponent, 
        ToolbarPacsComponent, 
        ToolbarUsersComponent, 
        ToolbarSettingsComponent, 
        ToolbarAboutComponent, 
        ToolbarLogoutComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule
    ],
    exports:[HeaderComponent, FormsModule, ReactiveFormsModule]
})
export class HeaderModule { }
