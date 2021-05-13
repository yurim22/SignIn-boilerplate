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
    ip = '112.220.20.178';
    port = '34243';

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

    save(): void {}

    close(): void {
        this.dialogRef.close();
    }

    onSubmit_Re(form): any {
        this.pacsConnectionChecking = true;
        setTimeout( () =>
            this.pacsConnectionChecking = false , 1000
        );
        // [TODO] pacs server connection test
        this.httpClient.get(`${form.value.ip}:${form.value.port}/peers`).subscribe(
            () => console.log('hellp'),
            (error) => console.log(error)
        );
    }
    onSubmit_Se(type: string): any {
        this.pacsConnectionCheckingSe = true;
        setTimeout( () =>
            this.pacsConnectionCheckingSe = false , 1000
        );
        this.isSuccessSe = true;
        this.seTestResult = 'PASS';
    }
}
