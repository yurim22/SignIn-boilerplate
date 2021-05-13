import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'toolbar-users',
    template: `
    <div id="icon_study_download down" class="flex-item-row top-menu-tools-container" (click)="openUsersModal()">
        <div title="Pacs" class="flex-top-menu-tools-icon-item-row">
            <img class="top-menu-tools-icon-button" src="assets/icons/customer.svg">
        </div>
        <div class="flex-top-menu-tools-icon-item-text">Users</div>
    </div>
    `,
    styles: [`
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
    `]
})
export class ToolbarUsersComponent {

    constructor(private dialog: MatDialog, private cookieService: CookieService) { }


    openUsersModal(): void {
        console.log('settings');
        const dialogRef = this.dialog.open(UsersDialogComponent, {
            autoFocus: false,
            width: '50vw',
            height: '55vh'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('the dialog was closed');
        });
    }

}
