import { Component, HostListener, Input, OnInit, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, skip, take, takeUntil, tap } from 'rxjs/operators';
import { SetSeriesInfo } from 'src/app/store/study/study.actions';
import { StudyState } from 'src/app/store/study/study.state';
import { StudyTableService } from '../study-table/study-table.service';

@Component({
    selector: 'app-report-image-list',
    templateUrl: './report-image-list.component.html',
    styleUrls: ['./report-image-list.component.css'],
    // encapsulation: ViewEncapsulation.ShadowDom,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportImageListComponent implements OnInit, OnDestroy {

    @Select(StudyState.getSeriesUrl) imgUrl$: Observable<string>;
    @Select(StudyState.getStudySeq) currentStudySeq$: Observable<number>;
    @Select(StudyState.selectedStudyStatus) studyStatus$: Observable<string>;
    // @Input() isAnalyzed;
    // @Input() isReceived;
    
    // @Output() confirmed = new EventEmitter<any>();

    isLastIndex: boolean = false;
    idx = 1
    report_img: string;
    error_report_img: string;
    hasReport: boolean = false;
    isConfirmed: boolean;

    isSelected: boolean;

    snack_message: string;
    // currentStudySeq: number;
    unsubscribe$ = new Subject();

    constructor(private _snackBar: MatSnackBar, private store: Store,
        private readonly changeDetectionRef: ChangeDetectorRef,
        private studyService: StudyTableService) { }

    ngOnInit() {
        this.imgUrl$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$) 
        ).subscribe()

        console.log(this.imgUrl$)

        this.currentStudySeq$.pipe(skip(1))
        //     .subscribe(
        //     (res) => {
        //         this.report_img = `${res}`;
        //         console.log(this.report_img)
        //         if(!!this.report_img){
        //             console.log('trye')
        //         }
        //     }
        // )
     
        this.studyStatus$.pipe(
            map(val => val === 'REVIEWED' || val === 'ANALYZED'? true : false),
            tap((res) => console.log(res))
        ).subscribe(
            (res) =>{
                this.hasReport = res;
                // this.currentStudySeq = res.study_seq
            }
        )
    }

    @HostListener('mousewheel', ['$event']) 
    onMousewheel(event) {
        // const step = 1;
        // if (event.wheelDelta > 0 && this.idx !== 1) {
        //     console.log('wheel up')
        //     this.idx = (this.idx - step) < 0 ? 0 : this.idx - step;
        // } else if(event.wheelDelta < 0 && this.idx !== 13){
        //     this.idx = this.idx + step;
        // } else if(this.idx === 1){
        //     this.snack_message = "This is the first page of the report"
        //     this.openSnackBar();
        // } else if(this.idx === 13) {
        //     this.snack_message = "This is the last page of the report"
        //     this.openSnackBar();
        // }

        // this.report_img = this.setImgPath(this.idx);
        console.log('mousewheel event')
        
    }

    // setImgPath() {
    //     console.log('setImgPath function');
    //     // return `assets/report_test_210216/${idx}.jpg`
    //     console.log('imgUrl$', this.imgUrl$)
    //     this.imgUrl$.pipe(

    //     )
    //     .subscribe(
    //         (res) => {
    //             console.log(res)
    //             //this.changeDetectionRef.detectChanges()
    //             return `./src/${res}`
    //         }
    //     )
    // }

    confirm() {
        console.log('confirm');
        // this.isConfirmed = true;
        // this.confirmed.emit(this.isConfirmed);
        this.studyService.updateStudyStatus({status: 'REVIEWED'}, 6).subscribe(
            (res) => {
                this.store.dispatch(new SetSeriesInfo(6, 'REVIEWED')),
                this.openSnackBar("Confirm Report")
            }
        )
    }

    openSnackBar(msg: string) {
        this._snackBar.open(msg, '', {
            duration: 1500,
            panelClass:'custom-snackbar',
            //horizontalPosition: 'right'
        }) 
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
