import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent {

    receiveForm: FormGroup;
    sendForm: FormGroup;
    
    ae: string = 'ORTHANCHP';
    ip: string = '58.151.234.205';
    port: string = '5252';

    pacsConnectionChecking: boolean;
    pacsConnectionChecking_se: boolean;
    reTestResult: string = ''
    seTestResult: string = ''
    isSuccess_re: boolean = false;
    isSuccess_se: boolean = false;
    cnt: number = 0;
    // isFail: boolean;
    constructor(
        public dialogRef: MatDialogRef<SettingsDialogComponent>,
        private fb: FormBuilder,
    ){
        this.receiveForm = fb.group({
            ae:[this.ae, Validators.required],
            ip:[this.ip,Validators.required],
            port:[this.port,Validators.required]
        });

        this.sendForm = fb.group({
            ae:[this.ae, Validators.required],
            ip:[this.ip,Validators.required],
            port:[this.port,Validators.required]
        })
    }

    save() {
        console.log('save')
        //this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    onSubmit_Re(type: string) {
        // console.log(this.${type}.value);
        this.pacsConnectionChecking = true
        setTimeout( () =>
            this.pacsConnectionChecking = false , 1000
        )
        if(type === "receiveForm" && this.cnt === 0){
            this.isSuccess_re = false;
            console.log(this.cnt);
            this.cnt += 1;
            this.reTestResult = 'FAIL';
        } else if(type === 'receiveForm') {
            this.isSuccess_re = true;
            this.reTestResult = 'OK';
        }
    }
    onSubmit_Se(type: string) {
        // console.log(this.${type}.value);
        this.pacsConnectionChecking_se = true
        setTimeout( () =>
            this.pacsConnectionChecking_se = false , 1000
        )
        this.isSuccess_se = true;
        this.seTestResult = 'OK'
    }
}
