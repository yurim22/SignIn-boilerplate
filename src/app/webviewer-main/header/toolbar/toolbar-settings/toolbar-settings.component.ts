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
    selector: 'toolbar-settings',
    templateUrl: './toolbar-settings.component.html',
    styleUrls: ['./toolbar-settings.component.css']
})

export class ToolbarSettingsComponent implements OnInit {

    userInfo: User
    constructor(private dialog: MatDialog) {
        // const user = new User();
        // user.id = localStorage.getItem('id');
        // user.name = localStorage.getItem('name');
        // user.seq = parseInt(localStorage.getItem('seq'))
        // this.userInfo = user
        // console.log(this.userInfo)
    }

    ngOnInit(): void {
        console.log('toolbar ngoninit')
    }  

    openUserSettingModal() {
        // console.log('settings')
        // const dialogRef = this.dialog.open(SettingsDialogComponent, {
        //     width: '31vw',
        //     height: '53vh',
        //     autoFocus: false
        // })

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('the dialog was closed');
        // })
        if(localStorage.getItem('permission') === 'PHYSICIAN'){
            const user = new User();
            user.id = localStorage.getItem('id');
            user.name = localStorage.getItem('name');
            user.seq = parseInt(localStorage.getItem('seq'))
            this.userInfo = user

            const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
                autoFocus: false,
                width: '17vw',
                height:'50vh',
                data: {userInfo: this.userInfo, mode: 'editMode'},
                hasBackdrop: false,
            })
        } else{
            console.log('settings')
            const dialogRef = this.dialog.open(SettingsDialogComponent, {
                width: '31vw',
                height: '53vh',
                autoFocus: false
            })

            dialogRef.afterClosed().subscribe(result => {
                console.log('the dialog was closed');
            })
        }
    }

}
