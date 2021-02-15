import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularMaterialsModule} from '../common/shared/angular-materials.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {WebviewerMainComponent} from './webviewer-main.component';
import { ToolbarPacsComponent } from './toolbar/toolbar-pacs/toolbar-pacs.component';
import { ReportImageListComponent } from './report-image-list/report-image-list.component';

@NgModule({
  declarations: [ToolbarPacsComponent, ReportImageListComponent],
  imports: [
    CommonModule,
    AngularMaterialsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  bootstrap: [WebviewerMainComponent]
})
export class WebviewerMainModule { }
