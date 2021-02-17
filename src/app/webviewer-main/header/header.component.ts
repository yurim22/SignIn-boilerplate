import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isToolbarReady: boolean = true;
    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    openSettingsDialog(): void {
        console.log('settings')
        // const dialogRef = this.dialog.open()
    }
}
