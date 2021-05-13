import { Component, Input, OnInit, ViewChild, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { skip, takeUntil} from 'rxjs/operators';

import { StudyRow} from '../../models/studyrow.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { GetStudyList, SetSeriesInfo } from 'src/app/store/study/study.actions';
import { Select, Store } from '@ngxs/store';
import { StudyState } from 'src/app/store/study/study.state';


@Component({
    selector: 'app-study-table',
    templateUrl: './study-table.component.html',
    styleUrls: ['./study-table.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class StudyTableComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() confirmedStudy: number;

    @Select(StudyState.getStudyList) studyList$: Observable<StudyRow[]>;

    unsubscribe$ = new Subject<any>();

    displayedColumns = ['status', 'patient_id', 'patient_name', 'sex', 'age', 'study_date', 'analysis_date', 'results', 'volumes'];
    displayedTitle = ['Status', 'Patient ID', 'Patient Name', 'Sex', 'Age', 'Study Date', 'Analysis Date', 'Results', 'Volumes'];
    // displayedColumns = ['status', 'patient_id', 'study_date', 'analysis_date', 'results', 'volumes']
    // displayedTitle = ['Status', 'Patient ID', 'Study Date', 'Analysis Date', 'Results', 'Volumes']

    dataSource = new MatTableDataSource<StudyRow>([]);
    sortedData: StudyRow[];

    constructor(
        private store: Store) {
        this.getStudyList();
    }

    ngOnInit(): void {
        this.studyList$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                console.log(res);
                this.dataSource.data = res;
            }
        );
    }

    ngAfterViewInit(): void {
        console.log('[StudyTableComponent.ngAfterViewInit]');

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

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

    getStudyList(): any {
        // tslint:disable-next-line: new-parens
        this.store.dispatch(new GetStudyList).subscribe(
            (res) => {
                console.log('res in getStudy List', res.study.allStudies);
                this.dataSource.data = res.study.allStudies;
            }
        );
    }

    getBackground(row): any{
        if (this.confirmedStudy === row.seq){
            return {selectedRow: true};
        }else{
            return {selectedRow: false};
        }
    }

    // 더블클릭하면, action파일의 SetSeriesInfo가 호출된다.
    onDblclick(row: StudyRow): void{
        console.log(row.confirmed_by);
        console.log(row);
        this.confirmedStudy = row.seq;
        this.store.dispatch(new SetSeriesInfo(row.seq, row.status, row.confirmed_by));
    }

    // tslint:disable-next-line: typedef
    onFilter() {
        console.log('filter click');
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
