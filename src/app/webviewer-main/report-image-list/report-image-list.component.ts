import { Component, HostListener, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, mapTo, skip, takeUntil, tap } from 'rxjs/operators';
import { UpdateStudyStatus } from 'src/app/store/study/study.actions';
import { StudyState } from 'src/app/store/study/study.state';

@Component({
    selector: 'app-report-image-list',
    templateUrl: './report-image-list.component.html',
    styleUrls: ['./report-image-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportImageListComponent implements OnInit, OnDestroy, AfterViewInit {

    @Select(StudyState.getSeriesUrl) imgUrl$: Observable<string>;
    @Select(StudyState.getStudySeq) currentStudySeq$: Observable<number>;
    @Select(StudyState.selectedStudyStatus) studyStatus$: Observable<string>;
    // @SelectSnapshot(StudyState.selectedStudyStatus) studyStatus: string;
    // @SelectSnapshot(StudyState.getConfirmedBy) confirmedBy: string;
    @Select(StudyState.getConfirmedBy) confirmedBy$: Observable<string>;

    @ViewChild('confirmButtonEl', {static: true }) confirmButtonEl: ElementRef<HTMLButtonElement>;

    // confirmButtonEl: ElementRef;
    isLastIndex = false;
    idx = 1;
    hasReport = false;
    isConfirmed: boolean;
    isSelected: boolean;
    snackMessage: string;
    currentStudySeq: number;
    unsubscribe$ = new Subject();
    studyStatus: string;

    constructor(private snackBar: MatSnackBar,
                private store: Store,
                private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // [TODO] series info에 대해서 다 따로 따로 받아오고 있는데 한꺼번에 객체로 받아와서 처리할 지 고민..
        // ngxs가 어려워가지고... ngxs 수정
        this.imgUrl$.pipe(
            // skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            res => console.log(res)
        );

        this.currentStudySeq$.pipe(
            // skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            res => {
                console.log(res);
                this.currentStudySeq = res;
            }
        );
        this.studyStatus$.pipe(
            // skip(1),
            tap(res => console.log(res)),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                console.log(res);
                this.studyStatus = res;
                // this.currentStudySeq = res.study_seq
                this.changeDetectorRef.detectChanges();
                console.log('--studystatus 바뀔 때 confirmedby', this.confirmedBy$.subscribe(() => console.log('he')));
            }
        );

        this.confirmedBy$.pipe(
            tap(res => console.log(res)),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                console.log(res);
            }
        );

        // fromEvent( this.confirmButtonEl.nativeElement, 'click').subscribe(
        //     () => {
        //         console.log('button clicked');
        //         this.studyStatus = 'REVIEWED';
        //         // this.confirmedBy = JSON.parse(localStorage.getItem('userInfo')).name;
        //         this.changeDetectorRef.detectChanges();
        //     }
        // );
    }
    // *ngIf로 해놔서 조건에 맞지 않을 경우 아예 template 형성이 되지 않는다.
    ngAfterViewInit(): void {
        // fromEvent( this.confirmButtonEl.nativeElement, 'click').subscribe(
        //     () => {
        //         console.log('button clicked');
        //         this.studyStatus = 'REVIEWED';
        //         // this.confirmedBy = JSON.parse(localStorage.getItem('userInfo')).name;
        //         this.changeDetectorRef.detectChanges();
        //     }
        // );
    }

    // [TODO] 실제 db 연결해서 이미지 받아오면 scroll 기능 연결
    @HostListener('mousewheel', ['$event'])
    // tslint:disable-next-line: typedef
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
        console.log('mousewheel event');

    }


    confirm(): any {
        const userName = JSON.parse(localStorage.getItem('userInfo')).name;
        this.store.dispatch(new UpdateStudyStatus(this.currentStudySeq, userName)).subscribe(
            (res) => {
                console.log('update study staus'),
                this.openSnackBar('confirm report');
                console.log('---after click confirm button', res.study.confirmUser);
                console.log(res);
                this.changeDetectorRef.detectChanges();
            }
        );
        // [TODO] confirm button 눌렀을 때 button 대신 confirmed by 넣는거
        // 더 좋은 로직이 있을 것 같다. 수정하기
        this.studyStatus = 'REVIEWED';
        // this.confirmedBy = JSON.parse(localStorage.getItem('userInfo')).name;
        this.changeDetectorRef.detectChanges();
        // console.log(this.confirmedBy);
    }

    openSnackBar(msg: string): void {
        this.snackBar.open(msg, '', {
            duration: 1500,
            panelClass: 'custom-snackbar',
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
