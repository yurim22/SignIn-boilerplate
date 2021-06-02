import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PacsService } from 'src/app/common/services/pacs.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent{

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
    currentUser: string;
    unsubscribe$ = new Subject();
    
    constructor(
        private dialogRef: MatDialogRef<SettingsDialogComponent>,
        private fb: FormBuilder,
        private httpClient: HttpClient,
        private pacsService: PacsService
    ){
        this.currentUser = JSON.parse(localStorage.getItem('userInfo')).id;
        this.userPermission = localStorage.getItem('permission');

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

        // receive data from db and setting in viewer
        this.pacsService.getReceivePacsInfo(this.currentUser).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                this.receiveForm.patchValue({
                    ae: res.AE,
                    ip: res.host_ip,
                    port: res.port
                });
            },
            (error) => console.log(error)
        );
        this.pacsService.getSendPacsInfo(this.currentUser).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                console.log(res);
                if (res) {
                    this.sendForm.patchValue({
                        ae: res.AE,
                        ip: res.client_ip,
                        port: res.port
                    });
                }
            },
            (error) => console.log(error)
        );
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

        console.log(form);
        this.pacsService.setReceivePacsInfo(form.value, this.currentUser).subscribe(
            () => {
                console.log('success');
                this.isSuccessRe = true;
                this.reTestResult = 'PASS';
            },
            (error) => {
                console.log('fail');
                this.isSuccessRe = false;
                this.reTestResult = 'FAIL';
            }
        );
    }
    onSubmit_Se(form): any {
        this.pacsConnectionCheckingSe = true;
        setTimeout( () =>
            this.pacsConnectionCheckingSe = false , 1000
        );
        // [TODO] setSendPacsInfo는 단지 form의 value를 db에 넣는 것 뿐, 실제 pacs server와의 connection test가 필요하다,
        this.pacsService.setSendPacsInfo(form.value, this.currentUser).subscribe(
            () => {
                console.log('success');
                this.isSuccessSe = true;
                this.seTestResult = 'PASS';
            },
            (error) => {
                console.log('fail');
                this.isSuccessSe = false;
                this.seTestResult = 'FAIL';
            }
        );
    }
}
