import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';


export interface SettingsData{
    description: string;
    category: string;

}
@Component({
    selector: 'toolbar-settings',
    templateUrl: './toolbar-settings.component.html',
    styleUrls: ['./toolbar-settings.component.css']
})

export class ToolbarSettingsComponent implements OnInit {

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {
    }  

    openUserSettingModal() {
        console.log('settings')
        const dialogRef = this.dialog.open(SettingsDialogComponent, {
            width: '570px',
            height: '430px',
            autoFocus: false
        })

        dialogRef.afterClosed().subscribe(result => {
            console.log('the dialog was closed');
        })
    }

}
