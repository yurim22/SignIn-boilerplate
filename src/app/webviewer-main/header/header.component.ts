import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserInfoService } from 'src/app/user-info.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isToolbarReady: boolean = true;
    permission= '';
    diskTotalUsage= 3;
    diskTotalSpace= 256;
    constructor(public dialog: MatDialog, private userInfoService: UserInfoService) { }

    ngOnInit(): void {
    }

    openSettingsDialog(): void {
        console.log('settings')
        // const dialogRef = this.dialog.open()
    }

    get userId(): string {
        console.log(this.userInfoService.userId)
        return this.userInfoService.userId
    }
}
