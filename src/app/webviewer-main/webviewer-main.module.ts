import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularMaterialsModule} from '../common/shared/angular-materials.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {WebviewerMainComponent} from './webviewer-main.component';
import { HeaderModule } from '../header/header.module';

@NgModule({
    declarations: [WebviewerMainComponent],
    imports: [
        CommonModule,
        AngularMaterialsModule,
        ReactiveFormsModule,
        FormsModule,
        HeaderModule
    ],
    bootstrap: [WebviewerMainComponent],
    exports: [
        AngularMaterialsModule,
    ],
})
export class WebviewerMainModule { }
