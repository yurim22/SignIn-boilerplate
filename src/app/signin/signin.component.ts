import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UserInfoService } from './services/user-info.service';
import { Store } from '@ngxs/store';
import { UpdateUserLoginStatus } from '../store/users/users.actions';

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
    passwordStatus: string;

    unsubscribe$: Subject<any>;

    constructor(private formBuilder: FormBuilder,
                private userInfoService: UserInfoService,
                private cookieService: CookieService,
                private authService: AuthService,
                private router: Router,
                private store: Store) {

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
        // this.store.reset(StudyState);
        // const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    }

    onSubmit(): any{
        const id = this.signInForm.value.id;
        const password = this.signInForm.value.password;

        // system integrity check => error 일때, onSubmit button에 대해서 error를 띄운다
        if (!this.isSystemIntegrityChecking && !this.isSystemIntegrityCheckingSuccess){
            this.isSigninFailed = true;
            this.signInFailedMsg = 'Server connection error';
        } else {
            this.authService.signIn(id, password).subscribe(
                (res) => {
                    this.isSigninFailed = false;
                    console.log('result in signin component', res);
                    // const userId = this.activatedRoute.snapshot.paramMap.get('userId');
                    if (res.pwdStatus === 'first login') {
                        this.passwordStatus = 'This is your first login.';
                        this.store.dispatch(new UpdateUserLoginStatus(this.passwordStatus));
                        this.router.navigate(['/changePwd', res.userId]);
                    } else if (res.pwdStatus === 'password expired') {
                        this.passwordStatus = 'Your password has been expired.';
                        this.store.dispatch(new UpdateUserLoginStatus(this.passwordStatus));
                        this.router.navigate(['/changePwd', res.userId]);
                    } else{
                        this.router.navigate(['/webviewer']);
                    }
                },
                (error) => {
                    this.isSigninFailed = true;
                    if (error.error.message === 'Wrong password more than 5 times'){
                        this.signInFailedMsg = 'Your account is locked';
                    }else{
                        this.signInFailedMsg = 'Invalid username or password.';
                    }
                }
            );
        }
        setTimeout(() => this.isSigninFailed = false, 3000);

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
