import { Component, HostListener, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { from, fromEvent, Observable, Subject } from 'rxjs';
import { concatMap, filter, map, mapTo, skip, takeUntil, tap } from 'rxjs/operators';
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
export class ReportImageListComponent implements OnInit, OnDestroy, AfterViewInit {

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
    constructor(private snackBar: MatSnackBar,
                private store: Store,
                private readonly changeDetectorRef: ChangeDetectorRef,
                private csService: CornerstoneService,
    ) {
        this.instances['#dicomImage'] = [];
        this.imageIndex = 0;
        // this.elementRef = elementRef;
    }

    ngOnInit(): void {
        this.element = this.dicomImage.nativeElement;
        cornerstone.enable(this.element);
        // [TODO] series info에 대해서 다 따로 따로 받아오고 있는데 한꺼번에 객체로 받아와서 처리할 지 고민..
        // ngxs가 어려워가지고... ngxs 수정
        this.imgUrl$.pipe(
            skip(1),
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                // this.changeDetectorRef.detectChanges();
                console.log(res);
                // [21.05.26] yurim => for http url
                this.csService.getSeriesImg(res).subscribe(
                    arr => {
                        if (arr.length !== 0) {
                            arr = arr.slice(0, 10);
                            this.instances['#dicomImage'] = arr;
                            console.log(this.instances);

                            const newArr = [];
                            this.instances['#dicomImage'].forEach(element => {
                                const url = res + `${element.sopInstanceUID}/dcm/jpeg95`;
                                newArr.push(url);
                            });
                            this.instances['#dicomImage'] = newArr;
                            console.log('final result of instance array', this.instances);
                            const wadoUri = `wadouri:${this.instances['#dicomImage'][this.imageIndex]}`;
                            console.log(wadoUri);
                            this.csService.fetchDicomImage(this.element, wadoUri);
                        }
                    },
                    (error) => {
                        alert('Error: This image is not supported by the Web viewer.');
                    }
                );

                // const wadoUri = `wadouri:${this.instances['#dicomImage'][this.imageIndex]}`;
                // console.log(wadoUri);
                // this.csService.fetchDicomImage(wadoUri).subscribe(
                //     val => console.log(val)
                // );
                // 21.05.25 connect url to loadImage function
                // from([0, 1, 2, 3, 4, 5, 6, 7, 8]).pipe(
                //     tap(val => console.log(val)),
                //     concatMap(val => this.csService.fetchDicomImage(`${res}_${val}.dcm`).pipe(
                //         tap(
                //             (result) => {
                //                 console.log(result);
                //                 this.imageData = result;
                //                 this.changeDetectorRef.detectChanges();
                //             }
                //         )
                //     ))
                // ).subscribe(
                //     val => {console.log(val); }
                // );

                // this.csService.fetchDicomImage(res).subscribe(
                //     data => {
                //         console.log(data);
                //         this.imageData = data;
                //         console.log(this.imageData);
                //     }
                // );
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

        // this.csService.fetchDicomImage(`assets/dicom/DKUS001545/DKUS001545_0.dcm`).subscribe(
        //     res => {
        //         this.imageData = res;
        //         console.log(`this imageData ${this.imageData}`);
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
    // @HostListener('mousewheel', ['$event'])
    // // tslint:disable-next-line: typedef
    // onMousewheel(event) {
    //     // const step = 1;
    //     // if (event.wheelDelta > 0 && this.idx !== 1) {
    //     //     console.log('wheel up')
    //     //     this.idx = (this.idx - step) < 0 ? 0 : this.idx - step;
    //     // } else if(event.wheelDelta < 0 && this.idx !== 13){
    //     //     this.idx = this.idx + step;
    //     // } else if(this.idx === 1){
    //     //     this.snack_message = "This is the first page of the report"
    //     //     this.openSnackBar();
    //     // } else if(this.idx === 13) {
    //     //     this.snack_message = "This is the last page of the report"
    //     //     this.openSnackBar();
    //     // }

    //     // this.report_img = this.setImgPath(this.idx);
    //     console.log('mousewheel event');

    // }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event): void {
        event.preventDefault();
        console.log('imageList', this.instances);
        const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        // console.log(event);

        if (delta > 0){
            // this.currentIndex ++;
            // console.log(this.currentIndex);
            // if ( this.currentIndex > this.imageList.length) {
            // this.currentIndex = this.imageList.length - 1;
            // }
            this.imageIndex --;
            if (this.imageIndex < 0){
                this.imageIndex = 0;
                this.snackMessage = 'This is the first page of the report';
                this.openSnackBar(this.snackMessage);
            }
        } else {
            // console.log(this.currentIndex);
            // this.currentIndex --;
            // if (this.currentIndex < 0){
            // this.currentIndex = 0;
            // }
            this.imageIndex ++;
            console.log(this.instances['#dicomImage'].length);
            console.log(this.imageIndex);
            if ( this.imageIndex === this.instances['#dicomImage'].length) {
                console.log('true');
                this.imageIndex =  this.imageIndex - 1;
                this.snackMessage = 'This is the last page of the report';
                this.openSnackBar(this.snackMessage);
            }
        }

        // this.image = this.imageList[this.currentIndex];
        //     // .filter( img => img.imageId === `wadouri:assets/dicom/DKUS001545/DKUS001545_${this.currentIndex}.dcm`)[0];
        // console.log(this.image);
        console.log(this.imageIndex);
        const newUrl = `wadouri:${this.instances['#dicomImage'][this.imageIndex]}`;
        this.csService.fetchDicomImage(this.element, newUrl);
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
            this.studyStatus = 'REVIEWED';
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

    displayImage(image: any): void {
        // console.log('display image', image);
        cornerstone.enable(this.element);
        // console.log('this element', this.element);
        console.log(image);
        cornerstone.displayImage(this.element, image);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
