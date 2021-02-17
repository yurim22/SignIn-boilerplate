import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-report-image-list',
    templateUrl: './report-image-list.component.html',
    styleUrls: ['./report-image-list.component.css']
})
export class ReportImageListComponent implements OnInit {

    @Input() isAnalyzed;
    isLastIndex: boolean = false;
    idx = 1
    report_img: string;
    constructor() { }

    ngOnInit(): void {
        this.report_img = 'assets/report_test_210216/1.jpg'
    }

    @HostListener('mousewheel', ['$event']) 
    onMousewheel(event) {
        const step = 1;
        if (event.wheelDelta > 0 && this.idx !== 1) {
            console.log('wheel up')
            this.idx = (this.idx - step) < 0 ? 0 : this.idx - step;
        }
        if (event.wheelDelta < 0 && this.idx !== 13) {
            this.idx = this.idx + step;
        }

        this.report_img = this.setImgPath(this.idx);
        
    }

    setImgPath(idx) {
        console.log('setImgPath function');
        return `assets/report_test_210216/${idx}.jpg`
    }

    confirm() {
        console.log('confirm');
    }
}
