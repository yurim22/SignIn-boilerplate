import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-webviewer-main',
    templateUrl: './webviewer-main.component.html',
    styleUrls: ['./webviewer-main.component.css']
})
export class WebviewerMainComponent implements OnInit {

    clickedStudy: number;
    isAnalyzed: boolean  = false;

    isConfirmed: boolean
    constructor() { }

    ngOnInit(): void {
    }   

    onDblclick(e){
        console.log(e);
        this.isConfirmed = false;
        if(e.status === 'Analyzed' || e.status === 'Reviewed'){
            console.log('success report');
            this.isAnalyzed = true;
            this.clickedStudy = e.id;
        } else if(e.status === 'Received'){
            this.isAnalyzed = false;
        }
        //e.result = 10;
    }

    confirmReport(result) {
        console.log(result);
        this.isConfirmed = result;
    }

    // confirm() {
    //     console.log('confirm');
        
    // }

    // setImgPath(idx) {
    //     console.log(idx);
    //     return `asset/report_test_210216/${idx}.jpg`
    // }
}
