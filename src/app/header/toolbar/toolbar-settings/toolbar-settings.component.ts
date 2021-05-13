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
    template: `
        <div id="icon_settings" class="flex-item-row top-menu-tools-container" (click)="openUserSettingModal()">
            <div title="Pacs" class="flex-top-menu-tools-icon-item-row">
                <img class="top-menu-tools-icon-button" src="assets/icons/profile.svg">
            </div>
            <div class="flex-top-menu-tools-icon-item-text">Settings</div>
        </div>
    `,
    styles: [
        `
            .top-menu-tools-icon-button{
                width: 18px;
                height: auto;
                padding: 12px 0px 0px 0px;
            }
            .flex-item-row{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .flex-top-menu-tools-icon-item-text {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                -webkit-font-smoothing: antialiased;
                color: #cecece;
                font-size: 10px;
                padding: 0px 0px 12px 0px;
                font-weight: 400;
                text-align: center;
                vertical-align: text-top;
                line-height: 0.6rem;
            }
            ::ng-deep .mat-dialog-container{
                background: #2B2B2B;
                padding: 0;
            }
        `
    ]
})

export class ToolbarSettingsComponent implements OnInit {

    userInfo: User;
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}

    openUserSettingModal(): void {

        if (JSON.parse(localStorage.getItem('userInfo')).permission === 'PHYSICIAN'){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

            const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
                autoFocus: false,
                width: '17vw',
                height: '60vh',
                data: {userInfo: this.userInfo, mode: 'editMode'},
                hasBackdrop: false,
            });
        } else{
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
