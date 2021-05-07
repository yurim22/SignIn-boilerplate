import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { UserInfoService } from '../services/user-info.service';
// import { Apollo, gql, Query } from 'apollo-angular';
import { Subject } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UserInfoService } from './services/user-info.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

    checked = false;
    passwordExpired = false;
    signInForm: FormGroup;
    rememberedId = '';
    regexPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}';
    rememberMeCheckboxChecked = false;
    isAboutModalOpened = false;
    isSystemIntegrityChecking = true;
    isSystemIntegrityCheckingSuccess = true;
    accessToken: string;
    refreshToken: string;
    isSigninFailed: boolean;
    invalidPasswordCountOver = false;
    signInFailedMsg: string;
    id = '';
    password = '';
    // oldPassword = '';
    // newPassword = '';
    // newPasswordRepeat = '';

    unsubscribe$: Subject<any>;

    constructor(private formBuilder: FormBuilder,
                private userInfoService: UserInfoService,
                private cookieService: CookieService,
                private authService: AuthService,
                private router: Router) {

        this.rememberedId = this.cookieService.get('rememberedId');

        this.signInForm = this.formBuilder.group({
            id: [this.rememberedId, Validators.required],
            password: ['', Validators.required]
        });

        this.isSigninFailed = false;
    }


    ngOnInit(): void {
        console.log('[yurim] signin ngOnInit');
        this.userInfoService.clear();

        this.userInfoService.getVersionInfo().subscribe(
            (result: any) => {
                console.log(result)
                setTimeout(() => {
                    this.isSystemIntegrityChecking = false;
                    this.isSystemIntegrityCheckingSuccess = true;
                }, 1500);
            },
            (error) => {
                this.isSystemIntegrityChecking = false;
                this.isSystemIntegrityCheckingSuccess = false;
            }
        );
    }

    getMyClass(): string {
        return 'login-wrapper non-banner-image';
    }

    onSubmit(): any{
        console.log('onsubmit button');
        const id = this.signInForm.value.id;
        const password = this.signInForm.value.password;

        if (!this.isSystemIntegrityChecking && !this.isSystemIntegrityCheckingSuccess){
            this.isSigninFailed = true;
            this.signInFailedMsg = 'Server connection error';
        } else {
            this.authService.signIn(id, password).subscribe(
                () => {
                    this.isSigninFailed = false;
                    this.router.navigate(['/webviewer']);
                },
                (error) => {
                    this.isSigninFailed = true;
                    console.log(error.error.message);
                    if (error.error.message === 'Wrong password more than 5 times'){
                        console.log('너 이제 락걸렸어');
                        this.signInFailedMsg = 'Your account is locked';
                    }else{
                        console.log('비밀번호 틀렸어');
                        this.signInFailedMsg = 'Invalid username or password.';
                    }
                }
            );
        }
        setTimeout(() => this.isSigninFailed = false, 3000);
        // this.authService.signIn(id, password).subscribe(
        //     () => {
        //         this.isSigninFailed = false;
        //         this.router.navigate(['/webviewer']);
        //     },
        //     (error) => {
        //         this.isSigninFailed = true;
        //         console.log(error.error.message);
        //         if (error.error.message === 'Wrong password more than 5 times'){
        //             console.log('너 이제 락걸렸어');
        //             this.signInFailedMsg = 'Your account is locked';
        //         }else{
        //             console.log('비밀번호 틀렸어');
        //             this.signInFailedMsg = 'Invalid username or password.';
        //         }
        //         setTimeout(() => this.isSigninFailed = false, 3000);
        //     }
        // );

        // rememberme checkbox
        if (this.rememberMeCheckboxChecked){
            this.cookieService.set('rememberedId', this.signInForm.value.id);
        } else{
            this.cookieService.set('rememberedId', '');
        }

    }

    isRememberedIdExist(): boolean {
        if (this.rememberedId === '' || this.rememberedId === undefined || this.rememberedId === null) {
            return false;
        } else {
            return true;
        }
    }

    onRemembermeChanged(e): void {
        this.rememberMeCheckboxChecked = e.checked;
    }

    showAboutDialog(): void{
        console.log('show about dialog');
    }

}
