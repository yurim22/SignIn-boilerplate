import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/signin/models/user.model';
import { CreateNewUserDialogComponent } from '../toolbar-users/users-dialog/new-user-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';


export interface SettingsData{
    description: string;
    category: string;
}
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'toolbar-settings',
    templateUrl: './toolbar-settings.component.html',
    styleUrls: ['./toolbar-settings.component.css']
})

export class ToolbarSettingsComponent implements OnInit {

    userInfo: User;
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        console.log('toolbar ngoninit');
    }

    openUserSettingModal(): void {

        if (JSON.parse(localStorage.getItem('userInfo')).permission === 'PHYSICIAN'){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

            const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
                autoFocus: false,
                width: '17vw',
                height: '50vh',
                data: {userInfo: this.userInfo, mode: 'editMode'},
                hasBackdrop: false,
            });
        } else{
            console.log('settings');
            console.log('setting pacs info');
            const dialogRef = this.dialog.open(SettingsDialogComponent, {
                width: '30vw',
                height: '53vh',
                autoFocus: false
            });

            dialogRef.afterClosed().subscribe(result => {
                console.log('the dialog was closed');
            });
        }
    }

}
