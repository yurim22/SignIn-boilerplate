import { HttpClient } from '@angular/common/http';
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
    ae: string;
    ip: string;
    port: string;

    pacsConnectionChecking: boolean;
    pacsConnectionCheckingSe: boolean;
    reTestResult: string;
    seTestResult: string;
    isSuccessRe: boolean;
    isSuccessSe: boolean;
    cnt: number;
    userPermission: string;

    constructor(
        private dialogRef: MatDialogRef<SettingsDialogComponent>,
        private fb: FormBuilder,
        private httpClient: HttpClient
    ){
        this.receiveForm = fb.group({
            ae: [this.ae, Validators.required],
            ip: [this.ip, Validators.required],
            port: [this.port, Validators.required]
        });

        this.sendForm = fb.group({
            ae: [this.ae, Validators.required],
            ip: [this.ip, Validators.required],
            port: [this.port, Validators.required]
        });

        this.userPermission = localStorage.getItem('permission');
    }

    save(): void {
        console.log('save');
    }

    close(): void {
        this.dialogRef.close();
    }

    onSubmit_Re(form): any {
        // console.log(this.${type}.value);
        this.pacsConnectionChecking = true;
        setTimeout( () =>
            this.pacsConnectionChecking = false , 1000
        );
        // if(type === "receiveForm" && this.cnt === 0){
        //     this.isSuccess_re = false;
        //     console.log(this.cnt);
        //     this.cnt += 1;
        //     this.reTestResult = 'FAIL';
        // } else if(type === 'receiveForm') {
        //     this.isSuccess_re = true;
        //     this.reTestResult = 'PASS';
        // }
        // [TODO] pacs server connection test
        this.httpClient.get(`${form.ip}:${form.port}/`);
    }
    onSubmit_Se(type: string): any {
        // console.log(this.${type}.value);
        this.pacsConnectionCheckingSe = true;
        setTimeout( () =>
            this.pacsConnectionCheckingSe = false , 1000
        );
        this.isSuccessSe = true;
        this.seTestResult = 'PASS';
    }
}
