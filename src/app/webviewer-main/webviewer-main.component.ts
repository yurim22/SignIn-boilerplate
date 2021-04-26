import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { filter, map } from 'rxjs/operators';
import { StudyRow } from '../models/studyrow.model';
import { AddSeriesImg, GetSeriesImg, SetSeriesInfo } from '../store/study/study.actions';
import { StudyTableService } from './study-table/study-table.service';

@Component({
    selector: 'app-webviewer-main',
    templateUrl: './webviewer-main.component.html',
    styleUrls: ['./webviewer-main.component.css']
})
export class WebviewerMainComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {}   

}
