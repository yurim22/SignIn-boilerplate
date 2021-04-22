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

    clickedStudy: number;
    isAnalyzed: boolean  = true;
    isReceived: boolean = false;

    isConfirmed: boolean
    isSelected: boolean;

    constructor(private studyTableService: StudyTableService,
        private store: Store) { }

    ngOnInit(): void {
    }   

    onDblclick(row: StudyRow): void{
        this.isConfirmed = false;
        this.clickedStudy = row.seq;
        // console.log(this.clickedStudy);
        // if(row.status === 'ANALYZED' || row.status === 'REVIEWED'){
        //     console.log('success report');
        //     this.isAnalyzed = true;
        //     this.isReceived = false;
        //     this.isSelected = true;
        // } else if(row.status === 'RECEIVED'){
        //     this.isReceived = true;
        //     this.isAnalyzed = false;
        // }

        // this.studyTableService.getSeriesItem(this.clickedStudy).pipe(
        //     map((res) => res.image_url)
        // ).subscribe(
        //     (url) => {
        //         console.log(url)
        //         //component -> action : action의 GetSeriesImg를 발생시킨다.
        //         this.store.dispatch([new GetSeriesImg(url)])
        //         console.log('this.store',this.store)
        //     }
        // )
        //더블클릭하면, action파일의 SetSeriesInfo가 호출된다.
        this.store.dispatch(new SetSeriesInfo(row.seq))

    }

    confirmReport(result) {
        //console.log(result);
        this.isConfirmed = result;
    }
}
