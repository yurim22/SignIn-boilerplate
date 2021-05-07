import { Component, HostListener, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, skip, takeUntil, tap } from 'rxjs/operators';
import { UpdateStudyStatus } from 'src/app/store/study/study.actions';
import { StudyState } from 'src/app/store/study/study.state';

@Component({
    selector: 'app-report-image-list',
    templateUrl: './report-image-list.component.html',
    styleUrls: ['./report-image-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportImageListComponent implements OnInit, OnDestroy {

    @Select(StudyState.getSeriesUrl) imgUrl$: Observable<string>;
    @Select(StudyState.getStudySeq) currentStudySeq$: Observable<number>;
    @Select(StudyState.selectedStudyStatus) studyStatus$: Observable<string>;

    isLastIndex = false;
    idx = 1;
    hasReport = false;
    isConfirmed: boolean;
    isSelected: boolean;
    snackMessage: string;
    currentStudySeq: number;
    unsubscribe$ = new Subject();

    constructor(private snackBar: MatSnackBar,
                private store: Store
    ) { }

    ngOnInit(): void {
        // [TODO] series info에 대해서 다 따로 따로 받아오고 있는데 한꺼번에 객체로 받아와서 처리할 지 고민..
        // ngxs가 어려워가지고... ngxs 수정
        this.imgUrl$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            res => console.log(res)
        );

        this.currentStudySeq$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            res => {
                console.log(res);
                this.currentStudySeq = res;
            }
        );

        this.studyStatus$.pipe(
            map(val => val === 'REVIEWED' || val === 'ANALYZED' ? true : false),
            tap((res) => console.log(res))
        ).subscribe(
            (res) => {
                this.hasReport = res;
                // this.currentStudySeq = res.study_seq
            }
        );

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
        this.store.dispatch(new UpdateStudyStatus(this.currentStudySeq)).subscribe(
            (res) => {
                console.log('update study staus'),
                this.openSnackBar('confirm report');
                console.log(res);
            }
        );
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
