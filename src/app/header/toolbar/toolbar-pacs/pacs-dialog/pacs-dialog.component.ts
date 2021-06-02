import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pacs-dialog',
  templateUrl: './pacs-dialog.component.html',
  styleUrls: ['./pacs-dialog.component.css']
})
export class PacsDialogComponent implements OnInit {

    hospitalDicomNodeAE: string;
    hospitalDicomNodeHost: string;
    hospitalDicomNodePort: string;

    constructor() {
        this.hospitalDicomNodeAE = 'ORTHANC';
        this.hospitalDicomNodeHost = '112.220.20.178';
        this.hospitalDicomNodePort = '34242';
    }

    ngOnInit(): void {
    }

    doHospitalDicomNodeQuery(): any {
        console.log('doHospitalDicomNodeQuery');
    }
}
