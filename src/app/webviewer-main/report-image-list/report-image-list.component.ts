import { Component, HostListener, Input, OnInit, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { StudyState } from 'src/app/store/study/study.state';

@Component({
    selector: 'app-report-image-list',
    templateUrl: './report-image-list.component.html',
    styleUrls: ['./report-image-list.component.css'],
    // encapsulation: ViewEncapsulation.ShadowDom,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportImageListComponent implements OnInit {

    @Select(StudyState.getSeriesUrl) imgUrl$: Observable<string>
    @Input() isAnalyzed;
    @Input() isReceived;
    
    @Output() confirmed = new EventEmitter<any>();

    isLastIndex: boolean = false;
    idx = 1
    report_img: string;
    error_report_img: string;

    isConfirmed: boolean;

    snack_message: string;

    constructor(private _snackBar: MatSnackBar, private store: Store,
        private readonly changeDetectionRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.imgUrl$.pipe(
            skip(1)
        ).subscribe(
            (res) => {
                this.report_img = `${res}`;
                console.log(this.report_img)
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
        this.isConfirmed = true;
        this.confirmed.emit(this.isConfirmed);
    }

    openSnackBar() {
        this._snackBar.open( this.snack_message, '', {
            duration: 1500,
            panelClass:'custom-snackbar',
            //horizontalPosition: 'right'
        }) 
    }
}
