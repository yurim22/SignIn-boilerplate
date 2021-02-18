import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent {

    settingsForm: FormGroup;
    
    ae: string;
    ip: string;
    port: string;

    constructor(
        public dialogRef: MatDialogRef<SettingsDialogComponent>,
        private fb: FormBuilder,
    ){
        this.settingsForm = fb.group({
            ae:[this.ae, Validators.required],
            ip:[this.ip,Validators.required],
            port:[this.port,Validators.required]
        });
    }

    save() {
        console.log('save')
        //this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    onSubmit() {
        console.log('submit');
    }
}
