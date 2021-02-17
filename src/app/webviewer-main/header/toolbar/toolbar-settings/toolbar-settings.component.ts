import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';


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

    // @ViewChild('userSettingDialog') userSettingDialog: TemplateRef<any>;

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {
    }  

    openUserSettingModal() {
        console.log('settings')
        // const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        
        // this.dialog.open(UserSettingDialog, dialogConfig);

        // const dialogRef = this.dialog.open(UserSettingsDialog, {
        //     width: '200px'
        // })

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('the dialog was closed');
        // })
    }

}

@Component({
    selector: 'user-settings-dialog',
    templateUrl:'./user-settings-dialog.component.html',
    styles:[`
        .mat-dialog-container{
            background-color: '#2d2d2d';
        }
    `
    ]
})

export class UserSettingsDialog{

    form: FormGroup;
    // description:string;

    constructor(
        public dialogRef: MatDialogRef<UserSettingsDialog>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: SettingsData
    ){
        //this.description = 'settings'

        this.form = fb.group({
            description: ['', Validators.required],
            category: ['', Validators.required],
            // releasedAt: [moment(), Validators.required],
            // longDescription: [longDescription,Validators.required]
        });
    }

    // onNoClick(): void{
    //     this.dialogRef.close();
    // }

    save() {
        console.log('save')
        //this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
}
