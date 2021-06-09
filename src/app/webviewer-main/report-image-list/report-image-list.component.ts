import { Component, HostListener, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { skip, takeUntil} from 'rxjs/operators';
import { CornerstoneService } from 'src/app/webviewer-main/cornerstone/cornerstone.service';
import { UpdateStudyStatus } from 'src/app/store/study/study.actions';
import { StudyState } from 'src/app/store/study/study.state';

import * as cornerstone from 'cornerstone-core';

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
    // @SelectSnapshot(StudyState.selectedStudyStatus) studyStatus: string;
    // @SelectSnapshot(StudyState.getConfirmedBy) confirmedBy: string;
    @Select(StudyState.getConfirmedBy) confirmedBy$: Observable<string>;

    @ViewChild('confirmButtonEl', {static: true }) confirmButtonEl: ElementRef<HTMLButtonElement>;
    @ViewChild('dicomImage', {static: true}) dicomImage: ElementRef;
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
    afterConfirm: boolean;
    imageData: any;
    instances = [];
    element: any;
    imageIndex: number;
    isImageLoading: boolean;
    constructor(private snackBar: MatSnackBar,
                private store: Store,
                private readonly changeDetectorRef: ChangeDetectorRef,
                private csService: CornerstoneService,
    ) {
        this.instances['#dicomImage'] = [];
        this.imageIndex = 0;
    }

    ngOnInit(): void {

        this.element = this.dicomImage.nativeElement;
        // [TODO] series info에 대해서 다 따로 따로 받아오고 있는데 한꺼번에 객체로 받아와서 처리할 지 고민..
        // ngxs가 어려워가지고... ngxs 수정
        this.imgUrl$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                cornerstone.disable(this.element);
                this.isImageLoading = true;
                this.imageIndex = 0;
                console.log(res);
                // [21.05.26] yurim
                this.csService.getSeriesImg(res).subscribe(
                    arr => {
                        if (arr.length !== 0) {
                            arr = arr.slice(0, 10);
                            this.instances['#dicomImage'] = arr;
                            console.log(arr);
                            console.log(this.instances);

                            const newArr = [];
                            this.instances['#dicomImage'].forEach(element => {
                                const url = res + `${element.sopInstanceUID}/dcm/jpeg95`;
                                newArr.push(url);
                            });
                            this.instances['#dicomImage'] = newArr;
                            const wadoUri = `wadouri:${this.instances['#dicomImage'][this.imageIndex]}`;
                            cornerstone.enable(this.element);
                            this.csService.fetchDicomImage(this.element, wadoUri);
                            this.isImageLoading = false;
                            this.changeDetectorRef.detectChanges();
                        } else{
                            alert('No report in this series');
                            return;
                        }
                    },
                    (error) => {
                        alert('Error: This image is not supported by the Web viewer.');
                    }
                );

            }
        );

        this.currentStudySeq$.pipe(
            // skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            res => {
                this.currentStudySeq = res;
            }
        );
        this.studyStatus$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                this.studyStatus = res;
                this.changeDetectorRef.detectChanges();
            }
        );

        this.confirmedBy$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe();

    }

    // image에 대한 mouse scroll 연결
    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event): void {
        event.preventDefault();
        // [21.05.27 yurim] 처음에 report가 띄워지지 않았는데, mousewheel에 대한 event 감지
        // 임시로 this.instances['#dicomImage'].length 가 0이 아닐 때만 wheel event 감지하도록
        // 조건문을 추가했다.
        // this.instances['#dicomImage'].length !== 0의 의미 => report를 불러오지 않았을 때
        if (this.instances['#dicomImage'].length !== 0) {
            const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            if (delta > 0){
                this.imageIndex --;
                if (this.imageIndex < 0){
                    this.imageIndex = 0;
                    this.snackMessage = 'This is the first page of the report';
                    this.openSnackBar(this.snackMessage);
                }
            } else {
                this.imageIndex ++;
                if ( this.imageIndex === this.instances['#dicomImage'].length) {
                    this.imageIndex =  this.imageIndex - 1;
                    this.snackMessage = 'This is the last page of the report';
                    this.openSnackBar(this.snackMessage);
                }
            }
            const newUrl = `wadouri:${this.instances['#dicomImage'][this.imageIndex]}`;
            this.csService.fetchDicomImage(this.element, newUrl);
        }
    }


    // [TODO] button이 text로 변하는 과정에서 약간 부자연스러운 부분이 존재.. 성능 개선 필요
    confirm(): any {
        const userName = JSON.parse(localStorage.getItem('userInfo')).name;
        this.store.dispatch(new UpdateStudyStatus(this.currentStudySeq, userName)).subscribe(
            (res) => {
                this.openSnackBar('confirm report');
                this.changeDetectorRef.detectChanges();
            }
        );
        this.studyStatus = 'Loading';
        // [TODO] confirm button 눌렀을 때 button 대신 confirmed by 넣는거
        // 더 좋은 로직이 있을 것 같다. 수정하기
        setTimeout(() => {
            this.studyStatus = 'Reviewed';
            this.changeDetectorRef.detectChanges();
        }, 800);
        // this.confirmedBy = JSON.parse(localStorage.getItem('userInfo')).name;
        this.changeDetectorRef.detectChanges();
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
