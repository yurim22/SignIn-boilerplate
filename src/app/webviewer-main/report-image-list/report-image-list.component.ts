import { Component, HostListener, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ignoreElements } from 'rxjs/operators';

@Component({
    selector: 'app-report-image-list',
    templateUrl: './report-image-list.component.html',
    styleUrls: ['./report-image-list.component.css'],
    //encapsulation: ViewEncapsulation.None
})
export class ReportImageListComponent implements OnInit {

    @Input() isAnalyzed;
    @Input() isReceived;
    
    @Output() confirmed = new EventEmitter<any>();

    isLastIndex: boolean = false;
    idx = 1
    report_img: string;
    error_report_img: string;

    isConfirmed: boolean;

    snack_message: string;

    constructor(private _snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.report_img = 'assets/report_test_210216/1.jpg';
        this.error_report_img = 'assets/report_test_210216/summary_test_error_1.jpg'
    }

    @HostListener('mousewheel', ['$event']) 
    onMousewheel(event) {
        const step = 1;
        if (event.wheelDelta > 0 && this.idx !== 1) {
            console.log('wheel up')
            this.idx = (this.idx - step) < 0 ? 0 : this.idx - step;
        } else if(event.wheelDelta < 0 && this.idx !== 13){
            this.idx = this.idx + step;
        } else if(this.idx === 1){
            this.snack_message = "This is the first page"
            this.openSnackBar();
        } else if(this.idx === 13) {
            this.snack_message = "This is the last page"
            this.openSnackBar();
        }

        this.report_img = this.setImgPath(this.idx);
        
    }

    setImgPath(idx) {
        // console.log('setImgPath function');
        return `assets/report_test_210216/${idx}.jpg`
    }

    confirm() {
        console.log('confirm');
        this.isConfirmed = true;
        this.confirmed.emit(this.isConfirmed);
    }

    openSnackBar() {
        this._snackBar.open( this.snack_message, '', {
            duration: 1000,
            panelClass:'custom-snackbar',
            //horizontalPosition: 'right'
        }) 
    }
}

// @Component({
//     selector:'snack-bar-component-last-page',
//     template: `
//         <span>{{snack_message}}</span>
//     `
// })

// export class LastPageComponent {
//     @Input() snack_message: string; 

// }
