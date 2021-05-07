import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommonDialogComponent } from '../dialog/common-dialog.component';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
    constructor(
        private dialog: MatDialog
    ) {}
    handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            //Backend returns unsuccessful response codes such as 404, 500 etc.
            console.error('Backend returned status code: ' + error.status);
            console.error('Response body:' + error.message);
            // if(error.status === 401){
            //     const dialogConfig = new MatDialogConfig;
            //     dialogConfig.hasBackdrop = true;
            //     dialogConfig.autoFocus = false;
            //     dialogConfig.panelClass = 'common-dialog';
            //     dialogConfig.data = {
            //         name: 'Logout',
            //         title: 'Token Expired',
            //         description: 'Token was expired. Please signin again',
            //         isConfirm: true,
            //         actionButtonText: 'OK',
            //     };

            //     const dialogRef = this.dialog.open(CommonDialogComponent, dialogConfig);
            //     dialogRef.afterClosed().subscribe(() => this.dialog.closeAll())
            // }
        } else {
            //A client-side or network error occurred.
            console.error(error)
            console.error('An error occurred:' + error.message);
        }
    }
}