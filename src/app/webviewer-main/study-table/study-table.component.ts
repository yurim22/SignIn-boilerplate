import { Component, Input, OnInit, ViewChild, ViewEncapsulation, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { filter, map, skip, takeUntil, tap} from 'rxjs/operators';

import { StudyRow} from '../../models/studyrow.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { from, merge, Subject, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { GetStudyList, SetSeriesInfo } from 'src/app/store/study/study.actions';
import { Select, Store } from '@ngxs/store';
import { StudyState } from 'src/app/store/study/study.state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudyTableService } from './study-table.service';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { FilterTextDialogComponent } from './filter-text-dialog/filter-text-dialog.component';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';


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
        private dialog: MatDialog,
        private snackBar: MatSnackBar) {
        this.getStudyList();
        this.statusForm = fb.group({
            ANALYZED: true,
            REVIEWED: true,
            RECEIVED: true
        });
    }

    ngOnInit(): void {
        this.studyList$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                console.log('-------in ngOninit', res);
                if (res.length === 0) {
                    console.log('there is no study data');
                    this.openSnackBar('There is no study data');
                }
                // this.reviewed$ = from(res).pipe(
                //     tap(val => console.log(val)),
                //     filter(val => val.status === 'REVIEWED'),
                //     tap(val => console.log(val)),
                //     map(val => val.status = 'Reviewed')
                // );
                // this.analyzed$ = from(res).pipe(
                //     filter(val => val.status === 'ANALYZED'),
                //     map(val => val.status = 'Analyzed')
                // );
                // this.received$ = from(res).pipe(
                //     filter(val => val.status === 'RECEIVED'),
                //     map(val => val.status = 'Received')
                // );
                // merge(this.analyzed$, this.reviewed$, this.received$).subscribe();
                this.dataSource.data = res;
            }

        );
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getStudyList(): any {
        this.store.dispatch(new GetStudyList(this.filterObj)).subscribe(
            (res) => {
                console.log('-----getStudyList()', res.study.allStudies);
                this.dataSource.data = res.study.allStudies;
                this.changeDetection.detectChanges();
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
            this.hasFilterCondition = true;
            this.getStudyList();
        });
    }

    // filtering table data with text => patient id, patient name
    onTextFilter(event, idx: number): void {
        const el = this.displayedColumns[idx];
        const elTitle = this.displayedTitle[idx];
        this.currentColumn = el;
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
            data: {title: this.displayedColumns[idx], query: this.filterObjForTemp[elTitle]}
        }).afterClosed().subscribe(result => {
            console.log('the dialog was closed', result);
            if (result !== undefined) {
                if (result.value !== '' && result.value !== undefined){
                    this.hasFilterCondition = true;
                    this.filterObj[el] = result.value;
                    this.filterObjForTemp[elTitle] = result.value;
                } else if (result.date.length !== 0){
                    this.hasFilterCondition = true;
                    const startDate = moment(result.date.startDate).format('YYYY-MM-DD');
                    const endDate = moment(result.date.endDate).format('YYYY-MM-DD');
                    this.filterObj[el] = `${startDate}-${endDate}`;
                    this.filterObjForTemp[elTitle] = `${startDate} ~ ${endDate}`;
                }
                this.getStudyList();
            }
        });
    }

    remove(condition: any): void {
        // [TODO]title의 index를 찾아내서 같은 이름의 조건 찾아내기
        const index = this.displayedTitle.indexOf(condition.key);
        delete this.filterObjForTemp[condition.key];
        delete this.filterObj[this.displayedColumns[index]];

        if (Object.keys(this.filterObjForTemp).length === 0) {
            this.hasFilterCondition = false;
        }
        this.getStudyList();
    }

    openSnackBar(msg: string): void {
        this.snackBar.open(msg, '', {
            duration: 1500,
            verticalPosition: 'top',
            // panelClass: 'custom-snackbar',
        });
    }

    private coloringFilterSymbol(name: string): boolean {
        // console.log(name);
        // console.log(Object.keys(this.filterObj));
        // console.log(Object.keys(this.filterObj).includes(name));
        return Object.keys(this.filterObj).includes(name);
    }
    /** Called by clicking previous or next button in the paginator */
    async onSelectPage(ev): Promise<void> {
        const skip = ev.pageIndex * ev.pageSize;
        console.log('---- page ', ev, ev.first, ev.last, skip);
        // if (this.studyFilteredColumn.length === 0) {
        //     this.dataSource.paginator = null;
        //     await this.getStudiesData();
        // }
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
