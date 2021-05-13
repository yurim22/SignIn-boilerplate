import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularMaterialsModule} from '../common/shared/angular-materials.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {WebviewerMainComponent} from './webviewer-main.component';
import { ReportImageListComponent } from './report-image-list/report-image-list.component';
import { HeaderModule } from '../header/header.module';
import { StudyTableComponent } from './study-table/study-table.component';
import { MousewheelEventDirective } from './mousewheel-event.directive';

@NgModule({
    declarations: [WebviewerMainComponent, ReportImageListComponent, StudyTableComponent, MousewheelEventDirective],
    imports: [
        CommonModule,
        AngularMaterialsModule,
        ReactiveFormsModule,
        FormsModule,
        HeaderModule
    ],
    bootstrap: [WebviewerMainComponent],
    exports: [
        ReportImageListComponent,
        StudyTableComponent,
        MousewheelEventDirective,
        AngularMaterialsModule
    ],
    // providers:[
    //     {
    //         provide: HTTP_INTERCEPTORS,
    //         useClass: AuthInterceptor,
    //         multi: true
    //     },
    // ]
})
export class WebviewerMainModule { }
