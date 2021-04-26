import { Component, Input, OnChanges, OnInit, Output, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';

import { Study } from '../../models/study.model';
import { StudyRow} from '../../models/studyrow.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs/internal/Observable';
import { merge, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { StudyTableService } from './study-table.service';
import { SetSeriesInfo } from 'src/app/store/study/study.actions';
import { Store } from '@ngxs/store';


@Component({
    selector: 'app-study-table',
    templateUrl: './study-table.component.html',
    styleUrls: ['./study-table.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class StudyTableComponent implements OnInit, OnChanges {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // @Input() isConfirmed: boolean;
    @Input() confirmedStudy: number;
    // @Input() isSelected: boolean;

    // @Output() clickRow = new EventEmitter<StudyRow>();
    unsubscribe$ = new Subject<any>();
    
    displayedColumns = ['status', 'patient_id', 'patient_name', 'sex', 'age', 'study_date', 'analysis_date', 'results', 'volumes']
    displayedTitle = ['Status', 'Patient ID', 'Patient Name', 'Sex', 'Age','Study Date', 'Analysis Date', 'Results', 'Volumes']
    
    dataSource = new MatTableDataSource<StudyRow>();

    isGetStudies: boolean = false;
    isAnalyzed: boolean = false;
    isReceived: boolean = false;

    sortedData: StudyRow[];
    
    // filteredAndPagedIssues: Observable<any>;

    // isLoadingResults: boolean;
    // isRateLimitReached:boolean;


    constructor(private studyTableService: StudyTableService,
        private store: Store) {
        console.log('constructor');
        this.getStudyList();
        // console.log(this.row)
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        console.log('[StudyTableComponent.ngAfterViewInit]');
    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        setTimeout(() => {
            this.isGetStudies = true;
        });

        // this.filteredAndPagedIssues = merge(this.sort.sortChange, this.paginator.page)
        // .pipe(
        //     startWith({}),
        //     switchMap(() => {
        //         this.isLoadingResults = true;
        //         return this.exampleDatabase!.getRepoIssues(
        //             this.sort.active, this.sort.direction, this.paginator.pageIndex);
        //     }),
        //     map(data => {
        //         // Flip flag to show that loading has finished.
        //         this.isLoadingResults = false;
        //         this.isRateLimitReached = false;
        //         this.resultsLength = data.total_count;

        //         return data.items;
        //     }),
        //     catchError(() => {
        //         this.isLoadingResults = false;
        //         // Catch if the GitHub API has reached its rate limit. Return empty data.
        //         this.isRateLimitReached = true;
        //         return observableOf([]);
        //     })
        // );
    }

    ngOnChanges():void {
        // if(this.isConfirmed) {
        //     console.log(this.dataSource.data[this.confirmedStudy-1])
        //     this.dataSource.data[this.confirmedStudy-1].status = "REVIEWED"
        // }
        // console.log('this.isSelected',this.isSelected);
        this.getStudyList()
    }

    getStudyList() {
        this.studyTableService.getStudyList().subscribe(
            (result)=> {
                console.log('result', result),
                this.dataSource.data = result
                console.log('getstudy list',this.dataSource.data);
            }
        )
    }
    // resetPaging(): void {
    //     this.paginator.pageIndex = 0;
    // }

    getBackground(row){
        if(this.confirmedStudy === row.seq){
            return {'selectedRow': true}
        }else{
            return {'selectedRow': false}
        }
    }

    //더블클릭하면, action파일의 SetSeriesInfo가 호출된다.
    onDblclick(row: StudyRow): void{
        // this.isConfirmed = false;
        this.confirmedStudy = row.seq;
        console.log('this.onDblclick')
        this.store.dispatch(new SetSeriesInfo(row.seq, row.status))
        console.log(row.status);

    }
}