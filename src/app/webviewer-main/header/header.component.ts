import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { Apollo, gql } from 'apollo-angular';
import { AuthService } from 'src/app/signin/auth/auth.service';
// import { UserInfoService } from 'src/app/services/user-info.service';
import { CommonDialogComponent } from '../../common/dialog/common-dialog.component';
import {UserInfoService} from "../../signin/services/user-info.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    isToolbarReady: boolean = true;

    diskTotalUsage= 3;
    diskTotalSpace= 256;
    
    unsubscribe$ = new Subject();

    constructor(
        public dialog: MatDialog,
        private userInfoService: UserInfoService) { }

    ngOnInit(): void {
        console.log('this is header component ngoninit');
        this.userInfoService.getCurrentUser().subscribe(
            (res) => {
                console.log(res);
                this.userInfoService.setUserInfo(res);
            },
            (error) => console.log(error)
        )
    }

    openSettingsDialog(): void {
        console.log('settings')
    }

    showLogoutModal() {
        const dialogConfig = new MatDialogConfig;
        dialogConfig.hasBackdrop = true;
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'common-dialog';
        dialogConfig.data = {
            name: 'Logout',
            title: 'Logout',
            description: 'Do you really want to log out?',
            isConfirm: true,
            actionButtonText: 'OK',
        };

        const dialogRef = this.dialog.open(CommonDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(() => this.dialog.closeAll())
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    
    get userId(): string {
        return localStorage.getItem('id')
    }

    get permission(): string {
        return localStorage.getItem('permission')
    }

    get name(): string {
        return localStorage.getItem('name')
    }

    get institution(): string {
        return localStorage.getItem('institution')
    }
}
