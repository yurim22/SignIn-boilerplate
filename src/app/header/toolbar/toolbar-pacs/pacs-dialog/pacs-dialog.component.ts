import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RemoteStudy } from 'src/app/models/remotestudy.model';

export interface PeriodicElement {
    patientName: string;
    patientID: string;
    studyInstanceUID: string;
    creationDate: string;
    creationTime: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {patientName: 'a', patientID: 'Hydrogen', studyInstanceUID: '1.0079', creationDate: 'b', creationTime: 'H'},
    {patientName: 'a', patientID: 'Helium', studyInstanceUID: '4.0026', creationDate: 'b', creationTime: 'He'},
    {patientName: 'a', patientID: 'Lithium', studyInstanceUID: '6.941', creationDate: 'b',creationTime: 'Li'},
    {patientName: 'a', patientID: 'Beryllium', studyInstanceUID: '9.0122', creationDate: 'b',creationTime: 'Be'},
    {patientName: 'a', patientID: 'Boron', studyInstanceUID: '10.811', creationDate: 'b',creationTime: 'B'},
    {patientName: 'a', patientID: 'Carbon', studyInstanceUID: '12.0107', creationDate: 'b',creationTime: 'C'},
    {patientName: 'a', patientID: 'Nitrogen', studyInstanceUID: '14.0067', creationDate: 'b',creationTime: 'N'},
    {patientName: 'a', patientID: 'Oxygen', studyInstanceUID: '15.9994',creationDate: 'b', creationTime: 'O'},
    {patientName: 'a', patientID: 'Fluorine', studyInstanceUID: '18.9984', creationDate: 'b',creationTime: 'F'},
    {patientName: 'a', patientID: 'Neon', studyInstanceUID: '20.1797',creationDate: 'b', creationTime: 'Ne'},
];

@Component({
  selector: 'app-pacs-dialog',
  templateUrl: './pacs-dialog.component.html',
  styleUrls: ['./pacs-dialog.component.css']
})
export class PacsDialogComponent implements OnInit {

    displayedColumns: string[] = ['select', 'patientID', 'patientName', 'studyInstanceUID', 'creationDate', 'creationTime'];
    // dataSource = new MatTableDataSource<RemoteStudy>();
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);
    filterEntity: PeriodicElement;

    systemBaseEnvironment: any;
    selectedServiceModeOption: string;
    hospitalDicomNodeAE: string;
    hospitalDicomNodeHost: string;
    hospitalDicomNodePort: string;
    localDcmFileRootPath: string;
    diskMinimumFreeSpace: string;

    remoteStudies: RemoteStudy[] = [];
    oversize: number;
    previousRemoteStudyDcmFileTransmissionStatusTimeoutExist: boolean;

    remoteStudyInstanceUIDsInTrasmissionStandBy: string[] = [];
    remoteStudyInstanceUIDsInTrasmission: string[] = [];
    remoteStudyInstanceUIDsInTrasmissionFailed: string[] = [];

    studyInstanceUIDsInTransmissionStandBy: string[] = [];
    studyInstanceUIDsInTransmission: string[] = [];
    tmpRemoteStudies: RemoteStudy[] = [];
    selectedRemoteStudies = [];

    constructor() {

    }

    ngOnInit(): void {
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): any {
        if (this.isAllSelected()) {
            this.selection.clear();
            this.selectedRemoteStudies = this.selection.selected;
            return;
        }

        this.selection.select(...this.dataSource.data);
        this.selectedRemoteStudies = this.selection.selected;
    }

    toggleValue(row): any {
        console.log(this.selection);
        this.selection.toggle(row);
        console.log(this.selection);
        this.selectedRemoteStudies = this.selection.selected;
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
    }


    doHospitalDicomNodeQuery(): any {
        console.log('doHospitalDicomNodeQuery');
    }

    private coloringFilterSymbol(name: string): boolean {
        // return Object.keys(this.filterObj).includes(name);
        return false;
    }
}
