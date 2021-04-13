import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/signin/auth.service';
//import { CommonService } from 'src/app/common/services/common.services';

@Component({
    template:
    `   <div [ngStyle]="{'max-width':'70vh'}" oncontextmenu="return false" ondragstart="return false" onselectstart="return false">
            <h3 class="dialog-title">{{modalData.title}}</h3>
            <div class="dialog-body">
                <p class="about-body">
                    {{modalData.description}}
                </p>
            </div>
            <div class="dialog-footer">
                <button type="button" *ngIf="modalData.isConfirm" class="btn-dialog btn-color" (click)="doAction()">{{modalData.actionButtonText}}</button>
                <button type="button" class="btn-dialog btn-color" (click)="close()">Cancel</button>
            </div>
        </div>
    `,
    styles:
    [`
        .dialog-title {
            font-family: "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-weight: 500;
            color: #ffffff;
            font-size: 26px;
        }
        .dialog-body {
            max-height: 70vh;
            overflow-y: auto;
            overflow-x: auto;
            padding: 0 0.125rem;
        }
        .about-body {
            font-size: 13px;
            color: #f2f2f2;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            -webkit-font-smoothing: antialiased;
        }
        .dialog-footer {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: end;
            justify-content: flex-end;
            padding: 1rem 0 0 0;
        }
        .btn-color {
            background-color: #212121;
            color: #fff;
        }
        .btn-dialog {
            cursor: pointer;
            display: inline-block;
            -webkit-appearance: none !important;
            border-radius: 0.125rem;
            border: 1px solid #2d2d2d;
            min-width: 3rem;
            max-width: 15rem;
            max-height: 1rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: center;
            vertical-align: middle;
            letter-spacing: 0.12em;
            font-size: 0.5rem;
            font-weight: 500;
            height: 1.5rem;
            margin: 3px;
        }
    `]
})
export class CommonDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public modalData: any,
                public dialogRef: MatDialogRef<CommonDialogComponent>,
                private authService: AuthService
                ) {}

    doAction() {
        switch (this.modalData.name) {
            case 'Logout':
                this.authService.logout();
                break;
            case 'Delete':
                break;
            case 'removeNodule':
                this.modalData.response = true;
                break;
            case 'removeStudy':
                this.modalData.response = true;
                break;
            case 'updateSeries':
                this.modalData.response = true;
                break;
            case 'closeMainView':
                window.close();
                break;
            case 'removeSyncFailStudies':
                this.modalData.response = true;
                break;
            case 'Link':
                this.modalData.response = true;
                break;
            default:
                break;
        }
        this.dialogRef.close(this.modalData);
    }

    close() {
        switch (this.modalData.name) {
            case 'removeNodule':
                this.modalData.response = false;
                this.dialogRef.close(this.modalData);
                break;
            default:
                this.dialogRef.close();
                break;
        }
    }
}
