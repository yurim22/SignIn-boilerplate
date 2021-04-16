import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserInfoService } from '../services/user-info.service';
// import { Apollo, gql, Query } from 'apollo-angular';
import { async, Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from '../models/user.model';
// import { FIND_USER } from 'src/app/common/graphql/gql';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';

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

    accessToken: string;
    refreshToken: string;
    
    isSigninFailed: boolean;

    constructor(private formBuilder: FormBuilder,
                private userInfoService: UserInfoService,
                private cookieService: CookieService,
                private authService: AuthService,
                private router: Router) {
        
        this.rememberedId = this.cookieService.get('rememberedId')

        this.signInForm = this.formBuilder.group({
            id: [this.rememberedId, Validators.required],
            password: ['', Validators.required]
        })

        this.isSigninFailed = false;
    }


    ngOnInit(): void {
        console.log('[yurim] signin ngOnInit');
        this.userInfoService.clear();
        setTimeout(() => {
            this.isSystemIntegrityChecking = false;
            this.isSystemIntegrityCheckingSuccess = true;
        }, 2000)

    }

    getMyClass() {
        return 'login-wrapper non-banner-image';
    }

    onSubmit(){
        this.authService.signIn(this.signInForm.value.id, this.signInForm.value.password).subscribe(
            () => {
                this.isSigninFailed = false;
                this.router.navigate(['/webviewer'])
            },
            (error)=> {
                this.isSigninFailed = true;
                console.log(error);
                setTimeout(() => this.isSigninFailed = false, 3000)
            }
        )

        //rememberme checkbox 
        if(this.rememberMeCheckboxChecked){
            this.cookieService.set('rememberedId', this.signInForm.value.id)
        } else{
            this.cookieService.set('rememberedId', '')
        }
        
    }

    isRememberedIdExist():boolean {
        if (this.rememberedId === '' || this.rememberedId === undefined || this.rememberedId === null) {
            return false;
        } else {
            return true;
        }
    }
    onRemembermeChanged(e) {
        console.log(e);
        this.rememberMeCheckboxChecked = e.checked
    } 

    showAboutDialog(){
        console.log('show about dialog')
    }

}
