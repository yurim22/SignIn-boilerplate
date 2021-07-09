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
    // reviewed$ = new Observable<any>();
    // analyzed$ = new Observable<any>();
    // received$ = new Observable<any>();

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
    PAGE_SIZE = 50; // page size
    skip = 0;
    searchCount = 0;
    firstPageSize: number;
    totalCount: number;
    studyList: StudyRow[];
    isLoadingResults: boolean;

    constructor(
        private store: Store,
        fb: FormBuilder,
        private studyTableService: StudyTableService,
        private changeDetection: ChangeDetectorRef,
        private dialog: MatDialog,
        private snackBar: MatSnackBar) {

        this.statusForm = fb.group({
            ANALYZED: true,
            REVIEWED: true,
            RECEIVED: true
        });
    }

    ngOnInit(): void {
        console.log('ngOnInit');
        this.dataSource.paginator = this.paginator;
        this.getStudyListWithLimitation();
    }

    ngAfterViewInit(): void {
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // this.paginator.length = this.totalCount;
        this.changeDetection.detectChanges();
    }

    // First of all, get the number of studies
    private getSearchCount(lastId: string, query: any, first = this.PAGE_SIZE): Observable<number> {
        return this.studyTableService.getStudiesCount(query).pipe(takeUntil(this.unsubscribe$));
    }

    // get all study data with count limitation
    private async getStudyListWithLimitation(): Promise<void> {
        this.isLoadingResults = true;
        await this.getSearchCount('', this.filterObj).subscribe(
            val => {
                if (val === 0) {
                    this.openSnackBar('There is no study data');
                    this.isLoadingResults = false;
                    return;
                }
                console.log('result of get the number of study data', val);
                // paginator에 lable 표시
                this.paginator.length = val;
                this.searchCount = val;
                // searchCount value 할당
                this.searchCount = this.searchCount < this.PAGE_SIZE ? this.searchCount : this.PAGE_SIZE;
                this.getStudyList();
            }
        );
    }

    // searchCount, skip 적용해서 db에서 데이터 받아오기(store에 저장된 데이터 가져옴)
    getStudyList(): any {
        this.store.dispatch(new GetStudyList(this.filterObj, this.searchCount, this.skip)).pipe(
            map(result => result.study.allStudies)
        ).subscribe(
            (res: StudyRow[]) => {
                this.isLoadingResults = false;
                console.log('-----getStudyList()', res);
                this.studyList = res;
                this.dataSource.data = res;

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
            console.log('statusForm values', values);
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
            this.skip = 0;
            this.paginator.pageIndex = 0;
            this.getStudyListWithLimitation();
            // this.getStudyList();
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
                this.skip = 0;
                this.paginator.pageIndex = 0;
                this.getStudyListWithLimitation();
            }
        });
    }

    remove(condition: any): void {
        // [TODO]title의 index를 찾아내서 같은 이름의 조건 찾아내기
        const index = this.displayedTitle.indexOf(condition.key);
        // status filtering을 cancle 할 때, checkbox 상태 원위치
        if (index === 0) {
            this.statusForm.patchValue({
                ANALYZED: true,
                REVIEWED: true,
                RECEIVED: true
            });
        }

        delete this.filterObjForTemp[condition.key];
        delete this.filterObj[this.displayedColumns[index]];
        if (Object.keys(this.filterObjForTemp).length === 0) {
            this.hasFilterCondition = false;
        }
        this.skip = 0;
        this.paginator.pageIndex = 0;
        this.getStudyListWithLimitation();
    }

    openSnackBar(msg: string): void {
        this.snackBar.open(msg, '', {
            duration: 1500,
            verticalPosition: 'top',
            // panelClass: 'custom-snackbar',
        });
    }

    // filter icon color on / off
    private coloringFilterSymbol(name: string): boolean {
        return Object.keys(this.filterObj).includes(name);
    }

    /** Called by clicking previous or next button in the paginator */
    async onSelectPage(ev): Promise<void> {
        this.skip = ev.pageIndex * ev.pageSize;
        console.log('---- page ', ev, ev.first, ev.last, this.skip);
        this.getStudyListWithLimitation();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
