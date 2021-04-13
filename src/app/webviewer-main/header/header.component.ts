import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Apollo, gql } from 'apollo-angular';
import { AuthService, LoginUserInfo } from 'src/app/signin/auth.service';
import { UserInfoService } from 'src/app/user-info.service';
import { CommonDialogComponent } from '../../common/dialog/common-dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isToolbarReady: boolean = true;
    //permission: string;
    diskTotalUsage= 3;
    diskTotalSpace= 256;

    current_user = this.userInfoService.getCurrentLoginUserInfo();

    constructor(
        public dialog: MatDialog, 
        private userInfoService: UserInfoService, 
        private authService: AuthService,
        private apollo: Apollo) { }

    ngOnInit(): void {
        console.log('this is header component ngoninit');
        console.log('this is current_user', this.current_user);
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
            // sessionUUID: this.session_uuid,
            // isMasterWindow: this.isMasterWindow()
        };
    
        this.dialog.open(CommonDialogComponent, dialogConfig);
    }
    

    get userId(): string {
        return this.userInfoService.userId
    }

    get permission(): string {
        return this.userInfoService.userPermission
    }

    get name(): string {
        return this.userInfoService.userName
    }

    get institution(): string {
        return this.userInfoService.userInstitution
    }
}
