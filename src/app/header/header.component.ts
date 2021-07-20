import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
// import { Apollo, gql } from 'apollo-angular';
import { CommonDialogComponent } from '../common/dialog/common-dialog.component';
import {UserInfoService} from '../signin/services/user-info.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
// [TODO] 맨처음 login 했을 때, error 처리 => localstorage에 아직 값이 없을 때
export class HeaderComponent implements OnInit, OnDestroy {

    isToolbarReady: boolean;

    diskTotalUsage = 3;
    diskTotalSpace = 256;
    unsubscribe$ = new Subject();

    constructor(
        public dialog: MatDialog,
        private userInfoService: UserInfoService) { }

    ngOnInit(): void {
        this.userInfoService.getCurrentUser().subscribe(
            (res) => {
                console.log(res);
                this.userInfoService.setUserInfo(res);
            },
            (error) => console.log(error)
        );
    }

    showLogoutModal(): void {
        // tslint:disable-next-line: new-parens
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
        dialogRef.afterClosed().subscribe(() => this.dialog.closeAll());
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    get userId(): string {
        if (localStorage.getItem('userInfo')) {
            return JSON.parse(localStorage.getItem('userInfo')).id;
        }
    }

    get permission(): string {
        if (localStorage.getItem('userInfo')) {
            return JSON.parse(localStorage.getItem('userInfo')).permission;
        }
    }

    get name(): string {
        return JSON.parse(localStorage.getItem('userInfo')).name;
    }

    get institution(): string {
        return JSON.parse(localStorage.getItem('userInfo')).institution;
    }
}
