import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-webviewer-main',
    templateUrl: './webviewer-main.component.html',
    styleUrls: ['./webviewer-main.component.css']
})
export class WebviewerMainComponent implements OnInit {
    isAnalyzed: boolean  = false;

    constructor() { }

    ngOnInit(): void {
    }   

    onDblclick(e){
        console.log(e);
        if(e.status === 'Analyzed'){
            console.log('success report');
            this.isAnalyzed = true;
        } else if(e.status === 'Received'){
            this.isAnalyzed = false;
        }
        e.result = 10;
    }

    confirmReport(e) {
        console.log(e);
    }

    // confirm() {
    //     console.log('confirm');
        
    // }

    // setImgPath(idx) {
    //     console.log(idx);
    //     return `asset/report_test_210216/${idx}.jpg`
    // }
}
