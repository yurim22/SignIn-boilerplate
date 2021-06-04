import { Component, Input, OnInit, ViewChild, ViewEncapsulation, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { filter, map, mapTo, skip, takeUntil, tap} from 'rxjs/operators';

import { StudyRow} from '../../models/studyrow.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs/internal/Observable';
import { from, merge, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { GetStudyList, SetSeriesInfo } from 'src/app/store/study/study.actions';
import { Select, Store } from '@ngxs/store';
import { StudyState } from 'src/app/store/study/study.state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudyTableService } from './study-table.service';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { FilterTextDialogComponent } from './filter-text-dialog/filter-text-dialog.component';


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
    reviewed$ = new Observable<any>();
    analyzed$ = new Observable<any>();
    received$ = new Observable<any>();

    displayedColumns = ['status', 'patient_id', 'patient_name', 'sex', 'age', 'study_date', 'analysis_date', 'results', 'volumes'];
    displayedTitle = ['Status', 'Patient ID', 'Patient Name', 'Sex', 'Age', 'Study Date', 'Analysis Date', 'Results', 'Volumes'];

    dataSource = new MatTableDataSource<StudyRow>([]);
    sortedData: StudyRow[];

    statusForm: FormGroup;
    sexForm: FormGroup;
    currentColumn: string;
    filterConditions = [];
    hasFilterCondition: boolean;
    visible = true;
    selectable = true;
    removable = true;
    filterObj = new Object();
    filterObjForTemp = new Object();
    constructor(
        private store: Store,
        fb: FormBuilder,
        private studyTableService: StudyTableService,
        private changeDetection: ChangeDetectorRef,
        private dialog: MatDialog) {
        this.getStudyList();
        this.statusForm = fb.group({
            ANALYZED: true,
            REVIEWED: true,
            RECEIVED: true
        });
        console.log('filterObj 입니다', this.filterObj);
    }

    ngOnInit(): void {
        this.studyList$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                // study list가 바뀔 때 마다 여기에서 받아서 새로운 table data를 만든다.
                console.log('studylist change');
                this.reviewed$ = from(res).pipe(
                    filter(val => val.status === 'REVIEWED'),
                    map(val => val.status = 'Reviewed')
                );
                this.analyzed$ = from(res).pipe(
                    filter(val => val.status === 'ANALYZED'),
                    map(val => val.status = 'Analyzed')
                );
                this.received$ = from(res).pipe(
                    filter(val => val.status === 'RECEIVED'),
                    map(val => val.status = 'Received')
                );
                merge(this.analyzed$, this.reviewed$, this.received$).subscribe();
                this.dataSource.data = res;
                console.log(this.dataSource.data);
            }
        );
        console.log(this.filterConditions);
    }

    ngAfterViewInit(): void {
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
        // this.filterObj[this.displayedColumns[0]] = 'Analyzed,Reviewed,Received';
        // tslint:disable-next-line: new-parens
        this.store.dispatch(new GetStudyList(this.filterObj)).subscribe(
            (res) => {
                console.log(this.statusForm);
                console.log(res);
                this.dataSource.data = res.study.allStudies;
            }
        );
        // if (this.statusForm){
        //     console.log('yes');
        // } else{
        //     this.store.dispatch(new GetStudyList({ANALYZED: true, REVIEWED: true, RECEIVED: true})).subscribe(
        //         (res) => {
        //             console.log(this.statusForm);
        //             console.log(res);
        //             this.dataSource.data = res.study.allStudies;
        //         }
        //     );
        // }
        // this.store.dispatch(new GetStudyList(this.statusForm.value)).subscribe(
        //     (res) => {
        //         console.log(this.statusForm);
        //         console.log(res);
        //         this.dataSource.data = res.study.allStudies;
        //     }
        // );
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
        this.confirmedStudy = row.seq;
        this.store.dispatch(new SetSeriesInfo(row.seq, row.status, row.confirmed_by));
    }

    // tslint:disable-next-line: typedef
    onStatusFilter(event, idx: number) {
        const el = this.displayedColumns[idx];
        this.currentColumn = el;
        const elTitle = this.displayedTitle[idx];
        event.stopPropagation();

        // statusForm의 변화를 감지하여 filtering 후의 새로운 data를 가져온다.
        this.statusForm.valueChanges.subscribe(values => {
            const selectedStatus = Object.entries(values).filter(status => status[1] === true)
            .map(status => status[0].toLowerCase()).map(status => status[0].toUpperCase() + status.slice(1))
            .map(status => `${status}`).join(',');

            if (selectedStatus === 'Analyzed,Reviewed,Received'){
                this.filterObjForTemp[elTitle] = 'All';
            } else{
                this.filterObjForTemp[elTitle] = selectedStatus;
            }

            this.filterObj[el] = selectedStatus; // ex. {status: " reviewed, received"}
            // this.filterObjForTemp[elTitle] = selectedStatus;
            this.hasFilterCondition = true;
            console.log(this.filterObj);
            this.store.dispatch(new GetStudyList(this.filterObj)).subscribe(
                (res) => {
                    this.dataSource.data = res.study.allStudies;
                    this.changeDetection.detectChanges();
                }
            );
        });
    }

    // filtering table data with text => patient id, patient name
    onTextFilter(event, idx: number): void {
        const el = this.displayedColumns[idx];
        this.currentColumn = el;
        const elTitle = this.displayedTitle[idx];
        event.stopPropagation();
        const y = window.scrollY + document.querySelector(`#${el}`).getBoundingClientRect().top; // Y
        const x = window.scrollX + document.querySelector(`#${el}`).getBoundingClientRect().left; // X
        const dialogPosition: DialogPosition = {
            left: Math.round(x - 50) + 'px',
            top: Math.round(y + 30) + 'px'
        };

        this.dialog.open(FilterTextDialogComponent, {
            panelClass: 'filter-text-dialog',
            position: dialogPosition,
            height: '85px',
            autoFocus: false,
            // data: {title: this.displayedCoFlumns[idx], query: this.getQuery(idx)}
        }).afterClosed().subscribe(result => {
            console.log('the dialog was closed', result);
            if (result.value !== ''){
                this.hasFilterCondition = true;
                this.filterObj[el] = result.value;
                this.filterObjForTemp[elTitle] = result.value;
            }
            this.store.dispatch(new GetStudyList(this.filterObj)).subscribe(
                (res) => {
                    this.dataSource.data = res.study.allStudies;
                    this.changeDetection.detectChanges();
                }
            );
        });
    }

    onDateFilter(event, idx: number): void {
        console.log('filtering by date');
        event.stopPropagation();
    }

    remove(condition: any): void {
        console.log('---condition', condition);
        console.log(this.statusForm);
        // [TODO]title의 index를 찾아내서 같은 이름의 조건 찾아내기
        const index = this.displayedTitle.indexOf(condition.key);
        console.log(index);
        delete this.filterObjForTemp[condition.key];
        delete this.filterObj[this.displayedColumns[index]];
        // delete this.filterObj[condition.key];
        console.log(this.filterObj);
        if (Object.keys(this.filterObjForTemp).length === 0) {
            this.hasFilterCondition = false;
        }
        this.store.dispatch(new GetStudyList(this.filterObj)).subscribe(
            (res) => {
                this.dataSource.data = res.study.allStudies;
                this.changeDetection.detectChanges();
            }
        );
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
