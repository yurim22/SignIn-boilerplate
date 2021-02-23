import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-webviewer-main',
    templateUrl: './webviewer-main.component.html',
    styleUrls: ['./webviewer-main.component.css']
})
export class WebviewerMainComponent implements OnInit {

    clickedStudy: number;
    isAnalyzed: boolean  = false;
    isReceived: boolean = false;

    isConfirmed: boolean
    isSelected: boolean;

    constructor() { }

    ngOnInit(): void {
    }   

    onDblclick(e){
        console.log(e);
        this.isConfirmed = false;
        this.clickedStudy = e.id;
        if(e.status === 'Analyzed' || e.status === 'Reviewed'){
            console.log('success report');
            this.isAnalyzed = true;
            this.isReceived = false;
            this.isSelected = true;
        } else if(e.status === 'Received'){
            this.isReceived = true;
            this.isAnalyzed = false;
        }
    }

    confirmReport(result) {
        //console.log(result);
        this.isConfirmed = result;
    }
}
