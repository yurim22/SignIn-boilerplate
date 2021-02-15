import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({ 
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    checked = false;

    passwordExpired = false;
    signInForm: FormGroup;

    rememberedId = '';

    id = '';
    password = '';
    // oldPassword = '';
    // newPassword = '';
    // newPasswordRepeat = '';

    invalidPasswordCountOver = false;

    regexPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}';

    rememberMeCheckboxChecked = false;
    isAboutModalOpened = false;

    isSystemIntegrityChecking = true;
    isSystemIntegrityCheckingSuccess = true;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private dialog: MatDialog,
                private snackbar: MatSnackBar) {

        this.signInForm = formBuilder.group({
            id: [this.rememberedId, Validators.required],
            password: ['', Validators.required]
        })
    }


    ngOnInit(): void {
        console.log('[yurim] signin ngOnInit');
        setTimeout(() => {
            this.isSystemIntegrityChecking = false;
            this.isSystemIntegrityCheckingSuccess = true;
        }, 2000)

    }

    getMyClass() {
        /* if (this.selectedServiceModeOption === 'basic') { */
            return 'login-wrapper non-banner-image';
        /* } else {
            return 'login-wrapper main-banner-image';
        } */
    }

    onSubmit(){
        console.log('submit');
        this.router.navigate(['/webviewer'])
    }

    isRememberedIdExist():boolean {
        return false;
    }
    onRemembermeChanged(e) {
        console.log(e);
        this.rememberMeCheckboxChecked = e.checked
    } 

    showAboutDialog(){
        console.log('show about dialog')
    }

}
